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
  await expect(page).toHaveTitle(/Desempleo en España/);
});

