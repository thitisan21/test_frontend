<template>
  <b-modal
    v-bind="$attrs"
    :hide-footer="hideFooter"
    :no-close-on-backdrop="true"
    centered
    :title="title"
    :hide-header="hideHeader"
    footer-class="border-0 py-12"
    @hide="onHideModal"
    :size="size"
    scrollable
  >
    <template v-slot:modal-header>
      <span class="modal-title">{{ title }}</span>
    </template>
    <slot name="content" />
    <template v-slot:modal-footer>
      <div class="d-flex justify-content-sm-end justify-content-between w-100">
        <!-- <ButtonCancel
          @click="closeModal(false)"
          class="mr-10"
          :text="'cancel'"
        />
        <slot name="buttonCenter" />
        <ButtonSubmit
          @click="closeModal(true)"
          :text="'submit'"
          v-if="hideButtonSubmit"
        /> -->
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "ModalForm",
  props: {
    title: {
      type: String,
      default: "",
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    hideButtonSubmit: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "lg",
    },
  },
  data() {
    return {
      status: false,
    };
  },
  computed: {},
  methods: {
    closeModal(status) {
      this.status = status;
      return this.$emit("submitDialog", status);
    },
    onHideModal(e) {
      this.$emit("onCLickOverlay", this.status);
      if (this.status) {
        this.status = false;
      }
    },
  },
};
</script>

<style></style>
