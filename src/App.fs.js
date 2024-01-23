import { Record, Union } from "./fable_modules/fable-library.4.1.4/Types.js";
import { record_type, option_type, union_type } from "./fable_modules/fable-library.4.1.4/Reflection.js";
import { view as view_1, update as update_1, init as init_1, Msg_$reflection as Msg_$reflection_1, Model_$reflection as Model_$reflection_1 } from "./pages/Login.fs.js";
import { ofArray, tail, head, isEmpty } from "./fable_modules/fable-library.4.1.4/List.js";
import { Cmd_map, Cmd_none } from "./fable_modules/Fable.Elmish.4.1.0/cmd.fs.js";
import { RouterModule_router, RouterModule_urlSegments } from "./fable_modules/Feliz.Router.4.0.0/./Router.fs.js";
import { createObj } from "./fable_modules/fable-library.4.1.4/Util.js";
import { singleton, delay, toList } from "./fable_modules/fable-library.4.1.4/Seq.js";
import { createElement } from "react";
import * as react from "react";
import { ProgramModule_mkProgram, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.1.0/program.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export class Url extends Union {
    constructor() {
        super();
        this.tag = 0;
        this.fields = [];
    }
    cases() {
        return ["LoginUrl"];
    }
}

export function Url_$reflection() {
    return union_type("App.Url", [], Url, () => [[]]);
}

export class SubModel extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["LoginModel", "NotFound"];
    }
}

export function SubModel_$reflection() {
    return union_type("App.SubModel", [], SubModel, () => [[["Item", Model_$reflection_1()]], []]);
}

export class Model extends Record {
    constructor(CurrentUrl, CurrentModel) {
        super();
        this.CurrentUrl = CurrentUrl;
        this.CurrentModel = CurrentModel;
    }
}

export function Model_$reflection() {
    return record_type("App.Model", [], Model, () => [["CurrentUrl", option_type(Url_$reflection())], ["CurrentModel", SubModel_$reflection()]]);
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["LoginMsg", "UrlChanged"];
    }
}

export function Msg_$reflection() {
    return union_type("App.Msg", [], Msg, () => [[["Item", Msg_$reflection_1()]], [["Item", option_type(Url_$reflection())]]]);
}

export function tryParseUrl(_arg) {
    let matchResult;
    if (!isEmpty(_arg)) {
        if (head(_arg) === "login") {
            if (isEmpty(tail(_arg))) {
                matchResult = 0;
            }
            else {
                matchResult = 1;
            }
        }
        else {
            matchResult = 1;
        }
    }
    else {
        matchResult = 0;
    }
    switch (matchResult) {
        case 0:
            return new Url();
        default:
            return void 0;
    }
}

export function initPage(url) {
    if (url == null) {
        return [new Model(url, new SubModel(1, [])), Cmd_none()];
    }
    else {
        const patternInput = init_1();
        const loginMsg = patternInput[1];
        const loginModel = patternInput[0];
        return [new Model(url, new SubModel(0, [loginModel])), Cmd_map((arg) => (new Msg(0, [arg])), loginMsg)];
    }
}

export function init() {
    let fullPath;
    return initPage(tryParseUrl((fullPath = (window.location.pathname + window.location.search), RouterModule_urlSegments(fullPath, 2))));
}

export function update(msg, model) {
    const matchValue = model.CurrentModel;
    if (msg.tag === 1) {
        const urlSegments = msg.fields[0];
        return initPage(urlSegments);
    }
    else if (matchValue.tag === 0) {
        const loginModel = matchValue.fields[0];
        const loginMsg = msg.fields[0];
        const patternInput = update_1(loginMsg, loginModel);
        const newLoginMsg = patternInput[1];
        const newLoginModel = patternInput[0];
        return [new Model(model.CurrentUrl, new SubModel(0, [newLoginModel])), Cmd_map((arg) => (new Msg(0, [arg])), newLoginMsg)];
    }
    else {
        return [model, Cmd_none()];
    }
}

export function view(model, dispatch) {
    let elements;
    return RouterModule_router(createObj(ofArray([["hashMode", 2], ["onUrlChanged", (arg_2) => {
        dispatch(new Msg(1, [tryParseUrl(arg_2)]));
    }], (elements = toList(delay(() => {
        const matchValue = model.CurrentModel;
        if (matchValue.tag === 1) {
            return singleton(createElement("p", {
                children: ["Not Found"],
            }));
        }
        else {
            const loginModel = matchValue.fields[0];
            return singleton(view_1(loginModel, (arg_4) => {
                dispatch(new Msg(0, [arg_4]));
            }));
        }
    })), ["application", react.createElement(react.Fragment, {}, ...elements)])])));
}

ProgramModule_run(Program_withReactSynchronous("elmish-app", ProgramModule_mkProgram(init, update, view)));

//# sourceMappingURL=App.fs.js.map
