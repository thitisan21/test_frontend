<template>
  <b-container fluid>
    <b-row>
      <b-col lg="6" class="my-1">
        <b-input-group size="sm">
          <b-form-input
            id="filter-input"
            v-model="filter"
            type="search"
            placeholder="Type to Search"
            @input="onSearch"
            debounce="500"
          ></b-form-input>

          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col lg="6" class="my-1">
        <div class="d-flex justify-content-end">
          <b-button @click="onClickCreate" size="sm"> Add</b-button>
        </div>
      </b-col>
    </b-row>
    <b-table
      id="my-table"
      :items="dataTable"
      :fields="fields"
      class="mt-16"
      hover
      outlined
      :sticky-header="'500px'"
    >
      <template #cell(action)="data">
        <b-button size="sm" @click="onClickEdit(data)">
          <b-icon icon="pencil"></b-icon
        ></b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="onClickDelete(data.item.id)"
          ><b-icon icon="trash"></b-icon
        ></b-button>
      </template>
    </b-table>
    <!-- {{dataTable}} -->
    <b-row align-h="between">
      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-align-sm="right"
          label-size="sm"
          class="mb-0 d-flex"
        >
          <b-form-select
            v-model="perPage"
            :options="pageOptions"
            @change="onClickLimit"
            size="sm"
            class="ml-1"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="4" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="dataSize"
          :per-page="perPage"
          @change="onClickPagination"
          aria-controls="my-table"
          align="fill"
          size="sm"
        ></b-pagination>
      </b-col>
    </b-row>
    <ModalForm
      :title="dataModal.title"
      id="openModalUser"
      @submitDialog="onSubmitModal"
      :hideButtonSubmit="dataModal.hideButtonSubmit"
    >
      <template #content>
        <b-row class="my-1">
          <b-col cols="6">
            <label for="input-live">Name:</label>
            <b-input v-model="form.name" class="col-12" />
          </b-col>
          <b-col cols="6">
            <label for="input-live">Username:</label>
            <b-input
              v-model="form.username"
              class="col-12"
              :disabled="is_edit"
            />
          </b-col>
          <b-col cols="6">
            <label for="input-live">Email:</label>
            <b-input v-model="form.email" class="col-12" />
          </b-col>
          <b-col cols="6">
            <label for="input-live">Street:</label>
            <b-input v-model="form.address.street" class="col-12" />
          </b-col>
          <b-col cols="6">
            <label for="input-live">Suite:</label>
            <b-input v-model="form.address.suite" class="col-12" />
          </b-col>
          <b-col cols="6">
            <label for="input-live">City:</label>
            <b-input v-model="form.address.city" class="col-12" />
          </b-col>
          <b-col cols="6">
            <label for="input-live">Zipcode:</label>
            <b-input v-model="form.address.zipcode" class="col-12" />
          </b-col>
          <b-col cols="6">
            <label for="input-live">Phone:</label>
            <b-input v-model="form.phone" class="col-12" />
          </b-col>
          <b-col cols="6">
            <label for="input-live">Website:</label>
            <b-input v-model="form.website" class="col-12" />
          </b-col>
        </b-row>
        <div class="d-flex justify-content-end">
          <b-button variant="danger" @click="$bvModal.hide('openModalUser')"
            >Cancel</b-button
          >
          <b-button class="ml-2" variant="outline-secondary" @click="onSave"
            >Save</b-button
          >
        </div>
      </template>
    </ModalForm>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import ModalForm from "./ModalForm.vue";
export default Vue.extend({
  name: "Table",
  props: {
    msg: String,
  },
  components: {
    ModalForm,
  },
  data: function () {
    return {
      fields: [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "address.street", label: "Street" },
        { key: "address.suite", label: "Suite" },
        { key: "address.city", label: "City" },
        { key: "address.zipcode", label: "Zipcode" },
        { key: "phone", label: "Phone" },
        { key: "website", label: "Website" },
        { key: "action", label: "Action" },
      ],
      filter: "",
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 20, 50],
      dataModal: {
        title: "Create User",
        type: null,
        view: false,
        hideButtonSubmit: false,
      },
      form: {
        id: undefined,
        name: undefined,
        username: undefined,
        email: undefined,
        address: {
          street: undefined,
          suite: undefined,
          city: undefined,
          zipcode: undefined,
        },
        phone: undefined,
        website: undefined,
      },
      is_edit: false,
    };
  },
  async mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      //   console.log(this.currentPage, this.perPage);
      await this.$store.dispatch("api/getUser", {
        search: "",
        skip: this.currentPage,
        limit: this.perPage,
      });
    },
    onClickPagination(e: number) {
      this.currentPage = e;
      this.getUser();
    },
    onClickLimit(e: number) {
      this.perPage = e;
      this.getUser();
    },
    async onClickCreate(data: any) {
      this.clearForm();
      this.is_edit = false;
      this.$bvModal.show("openModalUser");
    },
    async onClickEdit(data: any) {
      const setForm = this.setDefault(data);
      this.is_edit = true;
      this.form = setForm;
      this.dataModal.title = "Edit User";
      this.$bvModal.show("openModalUser");
    },
    async onClickDelete(id: string) {
      this.$bvModal
        .msgBoxConfirm("Are your sure??", {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then(async (value) => {
          if (value) {
            await this.axios.delete(
              `${process.env.VUE_APP_API_PATH}/api/user?id=${id}`
            );
            this.getUser();
          }
        })
        .catch((err) => {
          // An error occurred
        });

      //   this.$bvModal.show("openModalConfirmUser");
    },
    async onSubmitModal(status: any) {
      if (status) {
      } else {
        this.$bvModal.hide("openModalUser");
      }
    },
    async onSave(e: any) {
      if (!this.is_edit) {
        if (this.form.username != undefined) {
          await this.axios.post(
            `${process.env.VUE_APP_API_PATH}/api/user`,
            this.form
          );
        }
      } else {
        await this.axios.patch(
          `${process.env.VUE_APP_API_PATH}/api/user?id=${this.form.id}`,
          this.form
        );
      }

      this.getUser();
      this.$bvModal.hide("openModalUser");
    },
    async onSearch(data: string) {
      await this.$store.dispatch("api/getUser", {
        search: data,
        skip: 1,
        limit: this.perPage,
      });
    },
    setDefault(data: any) {
      let setForm = { ...data.item };
      let setAddress: any = {};

      setForm.id = data.item.id;
      setForm.name = data.item.name;
      setForm.username = data.item.username;
      setForm.email = data.item.email;
      setForm.phone = data.item.phone;
      setForm.website = data.item.phone;
      setAddress.street = data.item.address.street;
      setAddress.suite = data.item.address.suite;
      setAddress.city = data.item.address.city;
      setAddress.zipcode = data.item.address.zipcode;
      setForm.address = setAddress;

      return setForm;
    },
    clearForm() {
      this.form = {
        id: undefined,
        name: undefined,
        username: undefined,
        email: undefined,
        address: {
          street: undefined,
          suite: undefined,
          city: undefined,
          zipcode: undefined,
        },
        phone: undefined,
        website: undefined,
      };
    },
  },
  computed: {
    ...mapGetters("api", {
      dataTable: "dataTable",
      dataSize: "dataSize",
    }),
  },
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

tr {
  border-bottom: 1px solid #ddd;
}

/* table tbody tr {
  display: none;
} */
</style>
