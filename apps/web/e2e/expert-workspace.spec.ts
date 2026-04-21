import { test, expect } from '@playwright/test';

test.describe('专家工作面', () => {
  test('工作台、项目列表、新建项目与项目详情跳转', async ({ page }) => {
    await page.goto('/expert/workspace');

    await expect(page.getByRole('heading', { name: '工作台' })).toBeVisible();

    const sidebar = page.locator('nav');
    await sidebar.getByText('项目').click();
    await expect(page).toHaveURL(/\/expert\/projects/);
    await expect(page.getByRole('heading', { name: '项目' })).toBeVisible();

    await page.getByRole('link', { name: '新建项目' }).click();
    await expect(page).toHaveURL(/\/expert\/projects\/new/);

    await page.goto('/expert/projects');
    await expect(page.getByRole('heading', { name: '项目' })).toBeVisible();

    const projectRow = page.getByRole('cell', { name: 'AI 客服系统升级' }).first();
    await expect(projectRow).toBeVisible();
    await projectRow.click();
    await expect(page).toHaveURL(/\/expert\/projects\/proj-001/);
  });
});
