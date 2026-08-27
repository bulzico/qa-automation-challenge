import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { StoreWorld } from '../support/world.ts';

const baseUrl = process.env.E2E_BASE_URL ?? 'https://www.saucedemo.com/';

Given('que acesso a página de login da loja', async function (this: StoreWorld) {
  await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await expect(this.page.getByPlaceholder('Username')).toBeVisible();
});

When('entro com o usuário {string} e a senha {string}', async function (this: StoreWorld, user: string, password: string) {
  await this.page.getByPlaceholder('Username').fill(user);
  await this.page.getByPlaceholder('Password').fill(password);
  await this.page.getByRole('button', { name: 'Login' }).click();
});

When('tento entrar com o usuário {string} e a senha {string}', async function (this: StoreWorld, user: string, password: string) {
  await this.page.getByPlaceholder('Username').fill(user);
  await this.page.getByPlaceholder('Password').fill(password);
  await this.page.getByRole('button', { name: 'Login' }).click();
});

Then('devo acessar a lista de produtos', async function (this: StoreWorld) {
  await expect(this.page).toHaveURL(/inventory.html/);
  await expect(this.page.getByText('Products')).toBeVisible();
});

When('adiciono o produto {string} ao carrinho', async function (this: StoreWorld, product: string) {
  await this.page.getByText(product).locator('xpath=../../..').getByRole('button', { name: 'Add to cart' }).click();
  await expect(this.page.locator('.shopping_cart_badge')).toHaveText('1');
});

When('inicio o checkout', async function (this: StoreWorld) {
await this.page.locator('.shopping_cart_link').click();
await this.page.getByRole('button', { name: 'Checkout' }).click();
await expect(this.page).toHaveURL(/checkout-step-one.html/);
});

When('preencho os dados de entrega válidos', async function (this: StoreWorld) {
  await this.page.getByPlaceholder('First Name').fill('Cesar');
  await this.page.getByPlaceholder('Last Name').fill('Bulzico');
  await this.page.getByPlaceholder('Zip/Postal Code').fill('11660-000');
  await this.page.getByRole('button', { name: 'Continue' }).click();
});

When('finalizo a compra', async function (this: StoreWorld) {
  await expect(this.page).toHaveURL(/checkout-step-two.html/);
  await this.page.getByRole('button', { name: 'Finish' }).click();
});

When('envio o formulário de entrega sem o código postal', async function (this: StoreWorld) {
  await this.page.getByPlaceholder('First Name').fill('Cesar');
  await this.page.getByPlaceholder('Last Name').fill('Bulzico');
  await this.page.getByRole('button', { name: 'Continue' }).click();
});

Then('devo visualizar a confirmação do pedido', async function (this: StoreWorld) {
  await expect(this.page.getByText('Thank you for your order!')).toBeVisible();
});

Then('devo visualizar a mensagem de erro {string}', async function (this: StoreWorld, message: string) {
  await expect(this.page.locator('[data-test="error"]')).toContainText(message);
});
