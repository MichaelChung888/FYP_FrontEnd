import { Record, Union } from "./fable_modules/fable-library.4.1.4/Types.js";
import { record_type, option_type, union_type } from "./fable_modules/fable-library.4.1.4/Reflection.js";
import { view as view_3, update as update_1, init as init_3, Msg_$reflection as Msg_$reflection_1, Model_$reflection as Model_$reflection_1 } from "./pages/Login/Login.fs.js";
import { view as view_1, update as update_2, init as init_1, Msg_$reflection as Msg_$reflection_2, Model_$reflection as Model_$reflection_2 } from "./pages/MainStudent/MainStudent.fs.js";
import { view as view_2, update as update_3, init as init_2, Msg_$reflection as Msg_$reflection_3, Model_$reflection as Model_$reflection_3 } from "./pages/Projects/Projects.fs.js";
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
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["LoginUrl", "MainStudentUrl", "ProjectsUrl"];
    }
}

export function Url_$reflection() {
    return union_type("App.Url", [], Url, () => [[], [], []]);
}

export class SubModel extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["LoginModel", "MainStudentModel", "ProjectsModel", "NotFound"];
    }
}

export function SubModel_$reflection() {
    return union_type("App.SubModel", [], SubModel, () => [[["Item", Model_$reflection_1()]], [["Item", Model_$reflection_2()]], [["Item", Model_$reflection_3()]], []]);
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
        return ["LoginMsg", "MainStudentMsg", "ProjectsMsg", "UrlChanged"];
    }
}

export function Msg_$reflection() {
    return union_type("App.Msg", [], Msg, () => [[["Item", Msg_$reflection_1()]], [["Item", Msg_$reflection_2()]], [["Item", Msg_$reflection_3()]], [["Item", option_type(Url_$reflection())]]]);
}

export function tryParseUrl(_arg) {
    let matchResult;
    if (!isEmpty(_arg)) {
        switch (head(_arg)) {
            case "login": {
                if (isEmpty(tail(_arg))) {
                    matchResult = 0;
                }
                else {
                    matchResult = 3;
                }
                break;
            }
            case "main-student": {
                if (!isEmpty(tail(_arg))) {
                    if (head(tail(_arg)) === "projects") {
                        if (isEmpty(tail(tail(_arg)))) {
                            matchResult = 2;
                        }
                        else {
                            matchResult = 3;
                        }
                    }
                    else {
                        matchResult = 3;
                    }
                }
                else {
                    matchResult = 1;
                }
                break;
            }
            default:
                matchResult = 3;
        }
    }
    else {
        matchResult = 0;
    }
    switch (matchResult) {
        case 0:
            return new Url(0, []);
        case 1:
            return new Url(1, []);
        case 2:
            return new Url(2, []);
        default:
            return void 0;
    }
}

export function initPage(url) {
    if (url == null) {
        return [new Model(url, new SubModel(3, [])), Cmd_none()];
    }
    else {
        switch (url.tag) {
            case 1: {
                const patternInput_1 = init_1();
                const mainStudentMsg = patternInput_1[1];
                const mainStudentModel = patternInput_1[0];
                return [new Model(url, new SubModel(1, [mainStudentModel])), Cmd_map((arg_1) => (new Msg(1, [arg_1])), mainStudentMsg)];
            }
            case 2: {
                const patternInput_2 = init_2();
                const projectsMsg = patternInput_2[1];
                const projectsModel = patternInput_2[0];
                return [new Model(url, new SubModel(2, [projectsModel])), Cmd_map((arg_2) => (new Msg(2, [arg_2])), projectsMsg)];
            }
            default: {
                const patternInput = init_3();
                const loginMsg = patternInput[1];
                const loginModel = patternInput[0];
                return [new Model(url, new SubModel(0, [loginModel])), Cmd_map((arg) => (new Msg(0, [arg])), loginMsg)];
            }
        }
    }
}

export function init() {
    let fullPath;
    return initPage(tryParseUrl((fullPath = (window.location.pathname + window.location.search), RouterModule_urlSegments(fullPath, 2))));
}

export function update(msg, model) {
    const matchValue = model.CurrentModel;
    let matchResult, loginModel, loginMsg, mainStudentModel, mainStudentMsg, projectsModel, projectsMsg, urlSegments;
    switch (msg.tag) {
        case 1: {
            if (matchValue.tag === 1) {
                matchResult = 1;
                mainStudentModel = matchValue.fields[0];
                mainStudentMsg = msg.fields[0];
            }
            else {
                matchResult = 4;
            }
            break;
        }
        case 2: {
            if (matchValue.tag === 2) {
                matchResult = 2;
                projectsModel = matchValue.fields[0];
                projectsMsg = msg.fields[0];
            }
            else {
                matchResult = 4;
            }
            break;
        }
        case 3: {
            matchResult = 3;
            urlSegments = msg.fields[0];
            break;
        }
        default:
            if (matchValue.tag === 0) {
                matchResult = 0;
                loginModel = matchValue.fields[0];
                loginMsg = msg.fields[0];
            }
            else {
                matchResult = 4;
            }
    }
    switch (matchResult) {
        case 0: {
            const patternInput = update_1(loginMsg, loginModel);
            const newLoginMsg = patternInput[1];
            const newLoginModel = patternInput[0];
            return [new Model(model.CurrentUrl, new SubModel(0, [newLoginModel])), Cmd_map((arg) => (new Msg(0, [arg])), newLoginMsg)];
        }
        case 1: {
            const patternInput_1 = update_2(mainStudentMsg, mainStudentModel);
            const newMainStudentMsg = patternInput_1[1];
            const newMainStudentModel = patternInput_1[0];
            return [new Model(model.CurrentUrl, new SubModel(1, [newMainStudentModel])), Cmd_map((arg_1) => (new Msg(1, [arg_1])), newMainStudentMsg)];
        }
        case 2: {
            const patternInput_2 = update_3(projectsMsg, projectsModel);
            const newProjectsMsg = patternInput_2[1];
            const newProjectsModel = patternInput_2[0];
            return [new Model(model.CurrentUrl, new SubModel(2, [newProjectsModel])), Cmd_map((arg_2) => (new Msg(2, [arg_2])), newProjectsMsg)];
        }
        case 3:
            return initPage(urlSegments);
        default:
            return [model, Cmd_none()];
    }
}

export function view(model, dispatch) {
    let elements;
    return RouterModule_router(createObj(ofArray([["hashMode", 2], ["onUrlChanged", (arg_2) => {
        dispatch(new Msg(3, [tryParseUrl(arg_2)]));
    }], (elements = toList(delay(() => {
        const matchValue = model.CurrentModel;
        switch (matchValue.tag) {
            case 1: {
                const mainStudentModel = matchValue.fields[0];
                return singleton(view_1(mainStudentModel, (arg_6) => {
                    dispatch(new Msg(1, [arg_6]));
                }));
            }
            case 2: {
                const projectsModel = matchValue.fields[0];
                return singleton(view_2(projectsModel, (arg_8) => {
                    dispatch(new Msg(2, [arg_8]));
                }));
            }
            case 3:
                return singleton(createElement("p", {
                    children: ["Not Found"],
                }));
            default: {
                const loginModel = matchValue.fields[0];
                return singleton(view_3(loginModel, (arg_4) => {
                    dispatch(new Msg(0, [arg_4]));
                }));
            }
        }
    })), ["application", react.createElement(react.Fragment, {}, ...elements)])])));
}

ProgramModule_run(Program_withReactSynchronous("elmish-app", ProgramModule_mkProgram(init, update, view)));

//# sourceMappingURL=App.fs.js.map
