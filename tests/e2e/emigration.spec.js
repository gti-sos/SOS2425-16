// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:16078');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/API_GRUPO_16/);
});

test('get emigration link', async ({ page }) => {
  await page.goto('localhost:16078');

  // Click the emigration link.
  await page.getByRole('link', { name: 'Estadísticas sobre la emigración en España' }).click();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Emigracion España/);
});

test('create and delete data', async ({ page }) => {
  const testName = "__TEST_NAME__";
  const testYear = "2020";
  const testQuarter = "q1";
  const testBetween_20_24_yo = "1234";
  const testBetween_25_29_yo= "1212";
  const testBetween_30_34_yo= "1111";
  
  await page.goto('localhost:16078');

  // Click the get started link.
  await page.getByRole('link', { name: 'Estadísticas sobre la emigración en España' }).click();

  await page.getByRole('textbox').nth(0).fill(testName);
  await page.getByPlaceholder('Inserte año').fill(testYear); // cambiar porque no es textbox y no se como localizarla
  await page.getByRole('textbox').nth(1).fill(testQuarter);
  await page.getByPlaceholder('Nº Personas entre 20 y 24 años').fill(testBetween_20_24_yo);
  await page.getByPlaceholder('Nº Personas entre 25 y 29 años').fill(testBetween_25_29_yo);
  await page.getByPlaceholder('Nº Personas entre 30 y 34 años').fill(testBetween_30_34_yo);

  await page.getByRole('button', {name: "Insertar datos"}).click();

  const emigrationRow = page.locator('tr',{ hasText: testName});
  await expect(emigrationRow).toContainText(testYear);
  await expect(emigrationRow).toContainText(testQuarter); 
  await expect(emigrationRow).toContainText(testBetween_20_24_yo); 
  await expect(emigrationRow).toContainText(testBetween_25_29_yo); 
  await expect(emigrationRow).toContainText(testBetween_30_34_yo);  
  
  const deleteButton = emigrationRow.getByRole('button',{ name: 'Borrar'}); 
  await deleteButton.click();

  await expect(emigrationRow).toHaveCount(0);

});
