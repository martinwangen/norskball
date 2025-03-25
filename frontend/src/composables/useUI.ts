import { ref } from 'vue';
import { useQuasar } from 'quasar';

export function useUI() {
  const $q = useQuasar();
  const isLoading = ref(false);

  function showLoading(message = 'Loading...') {
    isLoading.value = true;
    $q.loading.show({
      message,
      spinnerColor: 'primary',
      spinnerSize: 80,
      backgroundColor: 'grey-3'
    });
  }

  function hideLoading() {
    isLoading.value = false;
    $q.loading.hide();
  }

  function showSuccess(message: string) {
    $q.notify({
      type: 'positive',
      message,
      position: 'top',
      timeout: 2500
    });
  }

  function showError(message: string) {
    $q.notify({
      type: 'negative',
      message,
      position: 'top',
      timeout: 3000
    });
  }

  function showConfirm(options: {
    title: string;
    message: string;
    okLabel?: string;
    cancelLabel?: string;
    persistent?: boolean;
  }) {
    return new Promise((resolve) => {
      $q.dialog({
        title: options.title,
        message: options.message,
        ok: {
          label: options.okLabel || 'OK',
          flat: true,
          color: 'primary'
        },
        cancel: {
          label: options.cancelLabel || 'Cancel',
          flat: true,
          color: 'grey'
        },
        persistent: options.persistent
      }).onOk(() => {
        resolve(true);
      }).onCancel(() => {
        resolve(false);
      });
    });
  }

  return {
    isLoading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    showConfirm
  };
}
