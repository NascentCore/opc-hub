import { test, expect } from '@playwright/test';

test.describe('园区工作面', () => {
  test('侧边导航与页面跳转', async ({ page }) => {
    await page.goto('/park/dashboard');

    const sidebar = page.locator('nav');
    await expect(sidebar.getByText('总览')).toBeVisible();
    await expect(page.getByRole('heading', { name: '园区总览' })).toBeVisible();

    await sidebar.getByText('OPC 团队').click();
    await expect(page).toHaveURL(/\/park\/teams/);

    await sidebar.getByText('权益管理').click();
    await expect(page).toHaveURL(/\/park\/entitlements/);
  });
});
