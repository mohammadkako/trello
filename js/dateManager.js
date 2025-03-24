export const dateManager = {
    init() {
        this.updateDate();
    },

    updateDate() {
        let date = new Date();
        date = date.toString().split(" ");
        document.querySelector("#date").innerHTML = date[1] + " " + date[2] + " " + date[3];
    }
}; 