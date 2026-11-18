import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../src/App';
import { StarImage, StarVideo, DEFAULT_IMAGE, DEFAULT_VIDEO } from '../src/components/StarMedia';

function navigate(route: string) {
  act(() => {
    window.history.replaceState(null, '', `#${route}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

beforeEach(() => {
  window.history.replaceState(null, '', '#/catalog');
  vi.stubGlobal('scrollTo', vi.fn());
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Каталог гостя', () => {
  it('применяет ползунок по кнопке, учитывает границу, показывает пустой результат и сбрасывает фильтр', () => {
    render(<App />);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    const slider = screen.getByRole('slider', { name: 'Максимальное расстояние от центра в килопарсеках' });
    fireEvent.change(slider, { target: { value: '18.4' } });
    expect(screen.getAllByRole('article')).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', { name: 'Найти' }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'Найти' }));
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByText('Звёзды не найдены')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Показать все' }));
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('35');
  });

  it('сохраняет фильтр после перехода в карточку и показывает медиа при пустых полях', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Найти' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
    navigate('/stars/4');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('M31-2252');
    expect(screen.getByAltText('Изображение по умолчанию для M31-2252').getAttribute('src')).toBe(DEFAULT_IMAGE);
    expect(document.querySelector('video')?.getAttribute('src')).toBe(DEFAULT_VIDEO);
    navigate('/catalog');
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('10');
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить' }));
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });

  it('переключает ленту циклически, сбрасывает раскрытие описания и оставляет два доступных пункта меню', () => {
    render(<App />);
    navigate('/feed');
    expect(document.title).toBe('Лента — M31 Galaxy Andromeda');
    expect(screen.getByRole('heading', { name: 'M31-V1' })).toBeTruthy();
    const description = screen.getByRole('checkbox', { name: 'Развернуть описание' }) as HTMLInputElement;
    fireEvent.click(description);
    expect(description.checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Открыть следующую звезду' }));
    expect(screen.getByRole('heading', { name: 'M31-1775' })).toBeTruthy();
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
    for (let index = 0; index < 5; index++) {
      fireEvent.click(screen.getByRole('button', { name: 'Открыть следующую звезду' }));
    }
    expect(screen.getByRole('heading', { name: 'M31-V1' })).toBeTruthy();
    const nav = screen.getByRole('navigation', { name: 'Основная навигация' });
    expect(nav.querySelectorAll('a[href]')).toHaveLength(4);
    expect(nav.querySelectorAll('[aria-disabled="true"]')).toHaveLength(0);
    navigate('/stars/999');
    expect(screen.getByRole('heading', { name: 'Звезда не найдена' })).toBeTruthy();
    navigate('/unknown');
    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeTruthy();
  });
});

describe('Локальные медиа', () => {
  it('заменяет пустые и недоступные изображения и видео локальными файлами', () => {
    const { unmount } = render(<><StarImage src="" name="Тест" /><StarVideo src="" /></>);
    expect(screen.getByRole('img').getAttribute('src')).toBe(DEFAULT_IMAGE);
    expect(document.querySelector('video')?.getAttribute('src')).toBe(DEFAULT_VIDEO);
    unmount();
    render(<><StarImage src="/missing.svg" name="Тест" /><StarVideo src="/missing.mp4" /></>);
    fireEvent.error(screen.getByRole('img'));
    fireEvent.error(document.querySelector('video')!);
    expect(screen.getByRole('img').getAttribute('src')).toBe(DEFAULT_IMAGE);
    expect(document.querySelector('video')?.getAttribute('src')).toBe(DEFAULT_VIDEO);
  });
});
