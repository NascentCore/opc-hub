import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('应展示 OPC 统一平台标题和两个工作面入口', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/OPC 统一平台/);
    await expect(page.getByRole('heading', { name: 'OPC 统一平台' })).toBeVisible();

    const parkButton = page.getByRole('link', { name: /园区\/机构工作面/ });
    const expertButton = page.getByRole('link', { name: /OPC 专家工作面/ });

    await expect(parkButton).toBeVisible();
    await expect(expertButton).toBeVisible();
  });
});
