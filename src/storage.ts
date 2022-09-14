import * as fs from "fs";

export default new class {
    stackData: { [key: string]: number } = {};

    save() {
        fs.writeFileSync("./storage.json", JSON.stringify(this.stackData));
    }

    load() {
        if (fs.existsSync("./storage.json")) {
            this.stackData = JSON.parse(fs.readFileSync("./storage.json").toString());
        }
    }
}
