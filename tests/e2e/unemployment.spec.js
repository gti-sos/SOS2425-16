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
  await page.getByRole('link', { name: 'Estadísticas sobre el desempleo en España' }).click();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Desempleo en España/);
});

test('create and delete data', async ({ page }) => {
    const testName = "__TEST_NAME__";
    const testYear = "2020";
    const testQuarter = "q1";
    const testUnemployment_rate = "1234";
    const testPrevious_quarter_var= "1212";
    const testPrevious_year_quarter_var= "1111";

    await page.goto('localhost:16078');

    // Click the get started link.
    await page.getByRole('link', { name: 'Estadísticas sobre el desempleo en España' }).click();

    await page.getByPlaceholder('Comunidad Autónoma').fill(testName);
    await page.getByPlaceholder('Inserte año').fill(testYear); // cambiar porque no es textbox y no se como localizarla
    await page.getByPlaceholder('Trimestre').fill(testQuarter);
    await page.getByPlaceholder('Tasa de desempleo').fill(testUnemployment_rate);
    await page.getByPlaceholder('Var. trimestre anterior').fill(testPrevious_quarter_var);
    await page.getByPlaceholder('Var. mismo trimestre año anterior').fill(testPrevious_year_quarter_var);

    await page.getByRole('button', {name: "Añadir"}).click();
});
