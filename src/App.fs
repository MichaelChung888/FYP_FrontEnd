module App

open Elmish
open Elmish.React
open Feliz
open Feliz.Router

open Login

type Url =
    | LoginUrl

type SubModel =
    | LoginModel of Login.Model
    | NotFound

type Model = {
    CurrentUrl: Url option
    CurrentModel: SubModel
}

type Msg =
    | LoginMsg of Login.Msg
    | UrlChanged of Url option

//--------------------------------------------------------------------------------------//
//                        Model Initalise [init : unit -> Model]                        //
//--------------------------------------------------------------------------------------//

let tryParseUrl = function
    | [] | ["login"] -> Some Url.LoginUrl
    | _ -> None

let initPage url =
    match url with
    | Some Url.LoginUrl ->
        let loginModel, loginMsg = Login.init()
        { CurrentUrl = url; CurrentModel = (SubModel.LoginModel loginModel) }, loginMsg |> Cmd.map LoginMsg
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
            | SubModel.NotFound ->
                Html.p "Not Found"
        ]
    ]

Program.mkProgram init update view
|> Program.withReactSynchronous "elmish-app"
|> Program.run