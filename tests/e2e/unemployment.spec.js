// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => { await page.goto('localhost:16078');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/API_GRUPO_16/);
});

test('get unemployment link', async ({ page }) => {
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

    await page.locator('#Comunidad').fill(testName);
    await page.locator('#Año').fill(testYear);
    await page.locator('#Trimestre').fill(testQuarter);
    await page.locator('#Tasa').fill(testUnemployment_rate);
    await page.locator('#VarAnt').fill(testPrevious_quarter_var);
    await page.locator('#VarSig').fill(testPrevious_year_quarter_var);

    await page.getByRole('button', {name: "Añadir"}).click();

    const unemploymentRow = page.locator('tr',{ hasText: testName});
    await expect(unemploymentRow).toContainText(testYear);
    await expect(unemploymentRow).toContainText(testQuarter); 
    await expect(unemploymentRow).toContainText(testUnemployment_rate); 
    await expect(unemploymentRow).toContainText(testPrevious_quarter_var); 
    await expect(unemploymentRow).toContainText(testPrevious_year_quarter_var);  
  
    const deleteButton = unemploymentRow.getByRole('button',{ name: 'Borrar'}); 
    await deleteButton.click();

    await expect(unemploymentRow).toHaveCount(0);
    
});
