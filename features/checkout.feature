@e2e
Feature: Checkout no e-commerce
  Como cliente, quero autenticar e concluir uma compra para receber meu pedido.

  Background:
    Given que acesso a página de login da loja

  Scenario: Login e checkout com dados válidos
    When entro com o usuário "standard_user" e a senha "secret_sauce"
    Then devo acessar a lista de produtos
    When adiciono o produto "Sauce Labs Backpack" ao carrinho
    And inicio o checkout
    And preencho os dados de entrega válidos
    And finalizo a compra
    Then devo visualizar a confirmação do pedido

  Scenario Outline: Login recusado
    When tento entrar com o usuário "<usuario>" e a senha "<senha>"
    Then devo visualizar a mensagem de erro "<mensagem>"

    Examples:
      | usuario          | senha        | mensagem                                                                    |
      | standard_user    | senha_errada | Username and password do not match any user in this service               |
      | usuario_invalido | secret_sauce | Username and password do not match any user in this service               |
      |                 |              | Username is required                                                       |

  Scenario: Checkout bloqueado por endereço incompleto
    When entro com o usuário "standard_user" e a senha "secret_sauce"
    And adiciono o produto "Sauce Labs Backpack" ao carrinho
    And inicio o checkout
    And envio o formulário de entrega sem o código postal
    Then devo visualizar a mensagem de erro "Postal Code is required"
