module App

open Elmish
open Feliz
open Feliz.Router

open LoginPage

type Url =
    | LoginPage

type Page =
    | LoginPage of LoginPage.Model
    | NotFound

type Model = {
    CurrentUrl: Url option
    CurrentPage: Page
}

type Msg =
    | LoginPageMsg of LoginPage.Msg
    | UrlChanged of Url option