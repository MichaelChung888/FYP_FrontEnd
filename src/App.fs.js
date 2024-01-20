import { Record, Union } from "./fable_modules/fable-library.4.1.4/Types.js";
import { record_type, option_type, union_type } from "./fable_modules/fable-library.4.1.4/Reflection.js";
import { Msg_$reflection as Msg_$reflection_1, Model_$reflection as Model_$reflection_1 } from "./pages/LoginPage.fs.js";

export class Url extends Union {
    constructor() {
        super();
        this.tag = 0;
        this.fields = [];
    }
    cases() {
        return ["LoginPage"];
    }
}

export function Url_$reflection() {
    return union_type("App.Url", [], Url, () => [[]]);
}

export class Page extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["LoginPage", "NotFound"];
    }
}

export function Page_$reflection() {
    return union_type("App.Page", [], Page, () => [[["Item", Model_$reflection_1()]], []]);
}

export class Model extends Record {
    constructor(CurrentUrl, CurrentPage) {
        super();
        this.CurrentUrl = CurrentUrl;
        this.CurrentPage = CurrentPage;
    }
}

export function Model_$reflection() {
    return record_type("App.Model", [], Model, () => [["CurrentUrl", option_type(Url_$reflection())], ["CurrentPage", Page_$reflection()]]);
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["LoginPageMsg", "UrlChanged"];
    }
}

export function Msg_$reflection() {
    return union_type("App.Msg", [], Msg, () => [[["Item", Msg_$reflection_1()]], [["Item", option_type(Url_$reflection())]]]);
}

//# sourceMappingURL=App.fs.js.map
