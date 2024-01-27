module App

open Elmish
open Elmish.React
open Feliz
open Feliz.Router

open Login
open MainStudent
open Projects

//--------------------------------------------------------------------------------------//
//                                        Types                                         //
//--------------------------------------------------------------------------------------//

type Url =
    | LoginUrl
    | MainStudentUrl
    | ProjectsUrl

type SubModel =
    | LoginModel of Login.Model

    | MainStudentModel of MainStudent.Model
    | ProjectsModel of Projects.Model
    | NotFound

type Model = {
    CurrentUrl: Url option
    CurrentModel: SubModel
}

type Msg =
    | LoginMsg of Login.Msg
    | MainStudentMsg of MainStudent.Msg
    | ProjectsMsg of Projects.Msg
    | UrlChanged of Url option

//--------------------------------------------------------------------------------------//
//                        Model Initalise [init : unit -> Model]                        //
//--------------------------------------------------------------------------------------//

let tryParseUrl = function
    | [] | ["login"] -> Some Url.LoginUrl
    | ["main-student"] -> Some Url.MainStudentUrl
    | ["main-student"; "projects"] -> Some Url.ProjectsUrl
    | _ -> None

let initPage url =
    match url with
    | Some Url.LoginUrl ->
        let loginModel, loginMsg = Login.init ()
        { CurrentUrl = url; CurrentModel = (SubModel.LoginModel loginModel) }, loginMsg |> Cmd.map Msg.LoginMsg

    | Some Url.MainStudentUrl ->
        let mainStudentModel, mainStudentMsg = MainStudent.init ()
        { CurrentUrl = url; CurrentModel = (SubModel.MainStudentModel mainStudentModel) }, mainStudentMsg |> Cmd.map Msg.MainStudentMsg

    | Some Url.ProjectsUrl ->
        let projectsModel, projectsMsg = Projects.init ()
        { CurrentUrl = url; CurrentModel = (SubModel.ProjectsModel projectsModel) }, projectsMsg |> Cmd.map Msg.ProjectsMsg  

    | None ->
        { CurrentUrl = url; CurrentModel = SubModel.NotFound }, Cmd.none

let init () : Model * Cmd<Msg> = 
    Router.currentPath()
   |> tryParseUrl
   |> initPage 

//--------------------------------------------------------------------------------------//
//                    Model Update [update : Msg -> Model -> Model]                     //
//--------------------------------------------------------------------------------------//

let update (msg: Msg) (model: Model) =
    match msg, model.CurrentModel with 
    | Msg.LoginMsg loginMsg, SubModel.LoginModel loginModel ->
        let newLoginModel, newLoginMsg = Login.update loginMsg loginModel
        { model with CurrentModel = SubModel.LoginModel newLoginModel }, newLoginMsg |> Cmd.map Msg.LoginMsg

    | Msg.MainStudentMsg mainStudentMsg, SubModel.MainStudentModel mainStudentModel ->
        let newMainStudentModel, newMainStudentMsg = MainStudent.update mainStudentMsg mainStudentModel
        { model with CurrentModel = SubModel.MainStudentModel newMainStudentModel}, newMainStudentMsg |> Cmd.map Msg.MainStudentMsg

    | Msg.ProjectsMsg projectsMsg, SubModel.ProjectsModel projectsModel ->
        let newProjectsModel, newProjectsMsg = Projects.update projectsMsg projectsModel
        { model with CurrentModel = SubModel.ProjectsModel newProjectsModel }, newProjectsMsg |> Cmd.map Msg.ProjectsMsg

    | UrlChanged urlSegments, _ ->
        initPage urlSegments
    | _ ->
        model, Cmd.none

//--------------------------------------------------------------------------------------//
//              Model View [view : Model -> (Msg -> unit) -> ReactElement]              //
//--------------------------------------------------------------------------------------//

let view (model: Model) (dispatch: Msg -> unit) =
    React.router [
        router.pathMode
        router.onUrlChanged (tryParseUrl >> UrlChanged >> dispatch)
        router.children [
            match model.CurrentModel with
            | SubModel.LoginModel loginModel ->
                Login.view loginModel (Msg.LoginMsg >> dispatch)
            | SubModel.MainStudentModel mainStudentModel ->
                MainStudent.view mainStudentModel (Msg.MainStudentMsg >> dispatch)
            | SubModel.ProjectsModel projectsModel ->
                Projects.view projectsModel (Msg.ProjectsMsg >> dispatch)
            | SubModel.NotFound ->
                Html.p "Not Found"
        ]
    ]

Program.mkProgram init update view
|> Program.withReactSynchronous "elmish-app"
|> Program.run