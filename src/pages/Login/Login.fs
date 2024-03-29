module Login

open Thoth.Fetch
open Thoth.Json

open Elmish

open Feliz
open Feliz.Bulma
open Feliz.Router

open color

open Zanaptak.TypedCssClasses
type Bulma = CssClasses<"https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css", Naming.PascalCase>

//--------------------------------------------------------------------------------------//
//                                      Post Types                                      //
//--------------------------------------------------------------------------------------//

type Login = 
    { 
    username: string
    password: string 
    }

    // Transform a JSON -> Login
    static member Decoder = 
        Decode.object (fun data -> {
            username = data.Required.Field "username" Decode.string
            password = data.Required.Field "password" Decode.string
        })

    /// Transform Login -> JSON
    static member Encoder (login: Login) =
        Encode.object [
            "username", Encode.string login.username
            "password", Encode.string login.password
        ]

//--------------------------------------------------------------------------------------//
//                                        Types                                         //
//--------------------------------------------------------------------------------------//

type Model = {
    login: Login
}

type Msg =
    | UsernameChanged of string
    | PasswordChanged of string
    | Submit of Browser.Types.Event
    | Success of string
    | Error of exn

//--------------------------------------------------------------------------------------//
//                        Model Initalise [init : unit -> Model]                        //
//--------------------------------------------------------------------------------------//

let init () : Model * Cmd<Msg> = 
    { login = { username = ""; password = "" } }, Cmd.none

//--------------------------------------------------------------------------------------//
//                    Model Update [update : Msg -> Model -> Model]                     //
//--------------------------------------------------------------------------------------//

let update (msg: Msg) (model: Model) =
    match msg with
    | UsernameChanged newUsername ->
        { model with login = { model.login with username = newUsername } }, Cmd.none
    | PasswordChanged newPassword ->
        { model with login = { model.login with password = newPassword} }, Cmd.none
    | Submit ev ->
        ev.preventDefault()
        let handleSubmit () = 
            promise {
                let url = "http://localhost:1234/login"
                let data = Login.Encoder(model.login)
                return! Fetch.post(url, data, decoder=Decode.string)
            }
        model, Cmd.OfPromise.either handleSubmit () Success Error
    | Success res ->
        Router.navigatePath("main")
        printfn "%A" res
        model, Cmd.none
    | Error res ->
        printfn "%A" res
        model, Cmd.none

//--------------------------------------------------------------------------------------//
//                                 Render Subcomponents                                 //
//--------------------------------------------------------------------------------------//

let TurquoiseBackground opacity =
    Html.div [
        prop.style [style.position.absolute; style.height (length.perc 100); style.width (length.perc 100); style.opacity opacity; style.zIndex -1; style.backgroundColor turqouise]
    ]

let TurquoiseBackgroundRGB opacity =
    style.backgroundColor (rgba (175, 238, 238, opacity))

let ImageBackground = 
    Html.img [
        prop.style [style.position.absolute; style.height (length.perc 100); style.width (length.perc 100); style.zIndex -2; style.overflow.hidden] // style.objectFit.cover;
        prop.src "/images/imperial.jpg"
    ]


let UsernameInput dispatch =
    Bulma.field.div [
        prop.children [
            Bulma.label [ prop.text "Username" ] 
            Html.div [
                prop.classes [Bulma.Control; Bulma.HasIconsLeft]
                prop.children [
                    Bulma.input.text [
                        prop.required true
                        prop.placeholder "Enter your Shortcode Username"
                        prop.onTextChange (UsernameChanged >> dispatch)
                    ]
                    Bulma.icon [
                        Bulma.icon.isSmall
                        Bulma.icon.isLeft
                        prop.children [
                            Html.i [
                                prop.classes ["fas fa-user"]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]

let PasswordInput dispatch = 
    Bulma.field.div [
        prop.children [
            Bulma.label [ prop.text "Password" ] 
            Html.div [
                prop.classes [Bulma.Control; Bulma.HasIconsLeft]
                prop.children [
                    Bulma.input.text [
                        prop.type'.password
                        prop.required true
                        prop.placeholder "Enter your Password"
                        prop.onTextChange (PasswordChanged >> dispatch)
                    ]
                    Bulma.icon [
                        Bulma.icon.isSmall
                        Bulma.icon.isLeft
                        prop.children [
                            Html.i [
                                prop.className "fas fa-lock"
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]

//--------------------------------------------------------------------------------------//
//              Model View [view : Model -> (Msg -> unit) -> ReactElement]              //
//--------------------------------------------------------------------------------------//

let view (model: Model) (dispatch: Msg -> unit) =
    Html.body [
        prop.style [style.height (length.vh 100); style.display.flex; style.alignItems.center; style.justifyContent.center]
        prop.children [

            TurquoiseBackground 0.5
            ImageBackground

            Html.div [
                prop.style [TurquoiseBackgroundRGB 0.7; style.position.relative; style.borderStyle.solid; style.borderColor mediumTurqouise; style.width (length.px 400); style.height (length.px 550); style.padding (length.px 10); style.display.flex; style.flexDirection.column; style.alignItems.center; style.justifyContent.center; style.borderRadius (length.perc 3)] //style.backgroundColor (rgb (0,0,0))
                prop.children [
                    Html.section [
                        prop.classes ["title"; "is-2"; Bulma.Field]
                        prop.text "EEFYP" //str "EEFYP Login"
                    ]

                    Html.section [
                        prop.style [style.textAlign.center; style.color gray]
                        prop.classes ["section"; "subtitle"; "is-5"; Bulma.Field]
                        prop.text "Electrical and Electronic final year project selection page"
                    ]

                    Html.form [
                        prop.onSubmit (Submit >> dispatch)
                        prop.style [style.width (length.perc 80)]
                        prop.children [

                            UsernameInput (dispatch)
                            PasswordInput (dispatch)
                            
                            Html.div [
                                prop.style [style.marginTop (length.px 35)]
                                prop.classes [Bulma.Field; Bulma.IsGrouped; Bulma.IsGroupedCentered]
                                prop.children [
                                    Bulma.control.div [
                                        Bulma.button.button [
                                            Bulma.color.isInfo
                                            prop.text "Login"
                                        ]
                                    ]
                                ]
                            ]                                
                        ]
                    ]

                    
                ]
            ]
        ]
    ]