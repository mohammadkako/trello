// مدیریت ذخیره‌سازی در localStorage
export const storage = {
    // دریافت آیتم‌ها از localStorage
    getItems() {
        return JSON.parse(localStorage.getItem('items')) || [];
    },

    // ذخیره آیتم‌ها در localStorage
    saveItems(items) {
        localStorage.setItem('items', JSON.stringify(items));
    },

    // اضافه کردن یک آیتم جدید
    addItem(item) {
        const items = this.getItems();
        items.push(item);
        this.saveItems(items);
        return items;
    },

    // حذف یک آیتم
    deleteItem(index) {
        const items = this.getItems();
        items.splice(index, 1);
        this.saveItems(items);
        return items;
    },

    // به‌روزرسانی یک آیتم
    updateItem(index, newValue) {
        const items = this.getItems();
        items[index].value = newValue;
        this.saveItems(items);
        return items;
    },

    // تغییر وضعیت انجام یک آیتم
    toggleItemStatus(index) {
        const items = this.getItems();
        items[index].done = !items[index].done;
        this.saveItems(items);
        return items;
    }
}; 