export const ToastManager = {
  toasts: new Map(),
  listeners: new Map(),
  addToast(toast) {
    const id = Date.now();
    this.toasts.set(id, { id, ...toast });
    this.onChange();
    return id;
  },
  removeToast(id) {
    this.toasts.delete(id);
    this.onChange();
  },
  replaceToast(id, toast) {
    this.toasts.set(id, toast);
    this.onChange();
  },
  addListener(cb) {
    this.listeners.set(cb, cb);
  },
  removeListener(cb) {
    this.listeners.delete(cb);
  },
  isActive(id) {
    return this.toasts.has(id);
  },
  onChange() {
    const toasts = Array.from(this.toasts.values());
    this.listeners.forEach(listener => listener(toasts));
  },
};
