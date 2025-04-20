// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('localhost:16078');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/API_GRUPO_16/);
});

test('get taxes link', async ({ page }) => {
    await page.goto('localhost:16078');

    // Click the emigration link.
    await page.getByRole('link', { name: 'Estadísticas sobre los impuestos en España' }).click();

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Impuestos España/);
});

test('create and delete data', async ({ page }) => {
    const testName = "__TEST_NAME__";
    const testYear = "2022";
    const testQuarter = "Q1";
    const testIRPF = "1234";
    const testSOC = "1212";
    const testIVA = "1111";

    await page.goto('localhost:16078');

    // Click the get started link.
    await page.getByRole('link', { name: 'Estadísticas sobre los impuestos en España' }).click();

    await page.getByPlaceholder('Inserte nombre').fill(testName);
    await page.getByPlaceholder('Inserte año').fill(testYear); // cambiar porque no es textbox y no se como localizarla
    await page.getByPlaceholder('Inserte trimestre').fill(testQuarter);
    await page.getByPlaceholder('Inserte IRPF').fill(testIRPF);
    await page.getByPlaceholder('Inserte impuesto de sociedades').fill(testSOC);
    await page.getByPlaceholder('Inserte IVA').fill(testIVA);

    await page.getByRole('button', { name: "Insertar datos" }).click();

    const taxesRow = page.locator('tr', { hasText: testName });
    await expect(taxesRow).toContainText(testYear);
    await expect(taxesRow).toContainText(testQuarter);
    await expect(taxesRow).toContainText(testIRPF);
    await expect(taxesRow).toContainText(testSOC);
    await expect(taxesRow).toContainText(testIVA);

    await page.getByPlaceholder('Inserte nombre').fill(testName);
    await page.getByPlaceholder('Inserte año').fill(testYear); // cambiar porque no es textbox y no se como localizarla
    await page.getByPlaceholder('Inserte trimestre').fill(testQuarter);
    await page.getByPlaceholder('Inserte IRPF').fill(testIRPF);
    await page.getByPlaceholder('Inserte impuesto de sociedades').fill(testSOC);
    await page.getByPlaceholder('Inserte IVA').fill(testIVA);

    const deleteButton = page.getByRole('button', { name: 'Borrar un dato' });
    await deleteButton.click();

    await expect(page.locator('tr', { hasText: testName })).toHaveCount(0);

    // const deleteAllButton = page.getByRole('button', { name: 'Borrar todos los datos' });
    // await deleteAllButton.click();

    // await expect(page.locator('tr', { hasText: testSearchName})).toHaveCount(0);
});

test('Search data', async ({ page }) => {
    const testSearchName = "Andalucía";
    const testSearchYear = "2020";

    await page.goto('localhost:16078');

    // Click the get started link.
    await page.getByRole('link', { name: 'Estadísticas sobre los impuestos en España' }).click();

    await page.getByPlaceholder('Inserte nombre').fill(testSearchName);
    await page.getByPlaceholder('Inserte año').fill(testSearchYear); // cambiar porque no es textbox y no se como localizarla

    await page.getByRole('button', { name: "Buscar datos" }).click();

    const taxesRow = page.locator('tr', { hasText: testSearchName });
    await expect(taxesRow).toContainText(testSearchYear);
});

test('Edit data', async ({ page }) => {
    await page.goto('localhost:16078');

    // Click the get started link.
    await page.getByRole('link', { name: 'Estadísticas sobre los impuestos en España' }).click();

    const testSearchName = "Andalucía";
    const testSearchYear = "2020";
    const testSearchQuarter = "Q1";
    // const testSearchIRPF = "2222";
    const testSearchSOC = "3333";
    const testSearchIVA = "4444";

    await page.getByPlaceholder('Inserte nombre').fill(testSearchName);
    await page.getByPlaceholder('Inserte año').fill(testSearchYear); // cambiar porque no es textbox y no se como localizarla
    await page.getByPlaceholder('Inserte trimestre').fill(testSearchQuarter); // cambiar porque no es textbox y no se como localizarla

    await page.getByRole('button', { name: "Buscar datos" }).click();

    await page.click(`text=${testSearchName}`);


    // await page.getByPlaceholder('Inserte impuesto de irpf').fill(testSearchIRPF);
    await page.getByPlaceholder('Inserte impuesto de sociedades').fill(testSearchSOC);
    await page.getByPlaceholder('Inserte IVA').fill(testSearchIVA);

    await page.getByRole('button', { name: "Actualizar datos de impuestos" }).click();

    await page.getByRole('button', { name: "Atrás" }).click();

    // const editInput = page.locator('tr', { hasText: testSearchName });
    // await editInput.click();
    // await editInput.press('Control+Backspace');
    await page.getByPlaceholder('Inserte nombre').fill(testSearchName);
    await page.getByPlaceholder('Inserte año').fill(testSearchYear); // cambiar porque no es textbox y no se como localizarla
    await page.getByPlaceholder('Inserte trimestre').fill(testSearchQuarter); // cambiar porque no es textbox y no se como localizarla

    await page.getByRole('button', { name: "Buscar datos" }).click();

    const taxesRow = page.locator('tr', { hasText: testSearchName });
    await expect(taxesRow).toContainText(testSearchYear);
    await expect(taxesRow).toContainText(testSearchQuarter);
    // await expect(taxesRow).toContainText(testSearchIRPF);
    await expect(taxesRow).toContainText(testSearchSOC);
    await expect(taxesRow).toContainText(testSearchIVA);
});
