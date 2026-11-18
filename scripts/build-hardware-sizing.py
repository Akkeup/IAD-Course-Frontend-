"""Build the one-page Lab 5 capacity estimate (pip install 'reportlab<5')."""
from math import ceil
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'output' / 'pdf' / 'lab5-hardware-requirements.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
FONT_DIR = Path('/System/Library/Fonts/Supplemental')
# Arial on macOS; DejaVu Sans on Linux.
if (FONT_DIR / 'Arial.ttf').exists():
    font_regular, font_bold = FONT_DIR / 'Arial.ttf', FONT_DIR / 'Arial Bold.ttf'
else:
    font_regular = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
    font_bold = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')
pdfmetrics.registerFont(TTFont('Body', str(font_regular)))
pdfmetrics.registerFont(TTFont('BodyBold', str(font_bold)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='BodyBold')

USERS, VIEWS, NEW_STARS, HOURS, DAYS, YEARS = 10_000, 30, 20, 8, 365, 5
REQUESTS = USERS * (VIEWS * 4 + 1 + 2) + NEW_STARS * 6
RPS = REQUESTS / (HOURS * 3600)
PEAK = RPS * 3
CORES = ceil(PEAK / (50 * .70))
STAR_FIELDS = [
    ('star_id', 'BIGSERIAL', '8', 8),
    ('created_by', 'BIGINT', '8', 8),
    ('star_name', 'VARCHAR(150)', '150 × 4 + 4', 604),
    ('star_catalog_id', 'VARCHAR(150)', '150 × 4 + 4', 604),
    ('distance_kpc', 'NUMERIC(6,2)', '2 × 2 + 8 (оценка)', 12),
    ('velocity_kms', 'INTEGER', '4', 4),
    ('star_status', 'VARCHAR(20)', '9 + 4 (published)', 13),
    ('star_description', 'TEXT, до 2000 символов', '2000 × 4 + 4', 8004),
    ('image_url', 'TEXT, ключ images/UUID.webp', '48 + 4', 52),
    ('video_url', 'TEXT, ключ videos/UUID.mp4', '47 + 4', 51),
    ('created_at', 'TIMESTAMPTZ', '8', 8),
    ('updated_at', 'TIMESTAMPTZ', '8', 8),
    ('formed_at', 'TIMESTAMPTZ', '8 (не NULL)', 8),
]
STAR_BYTES = sum(row[3] for row in STAR_FIELDS)
USER_BYTES = 8 + 104 + 132 + 8
LIKES_BYTES = 8 + 8 + 8
N_STARS = NEW_STARS * DAYS * YEARS
N_LIKES = USERS * DAYS * YEARS
DB = 2 * (N_STARS * (STAR_BYTES + 40) + N_LIKES * (LIKES_BYTES + 40) + USERS * (USER_BYTES + 40))
S3 = N_STARS * (5 + 20) * 2 ** 20
DISK = (DB + S3 + 30 * 10 ** 9) * 1.25
assert (STAR_BYTES, USER_BYTES, CORES) == (9384, 252, 4)
assert (DB, S3, DISK) == (3029792000, 956825600000, 1237319240000)

def num(n):
    return f'{n:,}'.replace(',', ' ')

styles = {
    'title': ParagraphStyle('title', fontName='BodyBold', fontSize=15, leading=18, spaceAfter=3),
    'subtitle': ParagraphStyle('subtitle', fontName='Body', fontSize=9, leading=12, spaceAfter=8),
    'body': ParagraphStyle('body', fontName='Body', fontSize=9.3, leading=12.5, spaceAfter=4),
    'head': ParagraphStyle('head', fontName='BodyBold', fontSize=10, leading=13, spaceBefore=5, spaceAfter=4),
    'small': ParagraphStyle('small', fontName='Body', fontSize=8, leading=10.3, spaceAfter=3),
    'cell': ParagraphStyle('cell', fontName='Body', fontSize=8.2, leading=10.2),
    'cellbold': ParagraphStyle('cellbold', fontName='BodyBold', fontSize=8.2, leading=10.2),
    'result': ParagraphStyle('result', fontName='BodyBold', fontSize=10, leading=13, spaceBefore=5, spaceAfter=5),
}

def p(text, style='body'):
    return Paragraph(text, styles[style])

story = [
    p('Расчёт аппаратных требований', 'title'),
    p('Лабораторная работа 5 • M31 Galaxy Andromeda • горизонт планирования 5 лет', 'subtitle'),
    p('<b>Проектная оценка полного сервиса:</b> React, backend, PostgreSQL и S3/MinIO на одном узле. '
      'Числа нагрузки и производительность ядра приняты для учебного расчёта, а не измерены на mock-SPA.'),
    p('<b>Исходные данные:</b> 10 000 активных пользователей; 30 просмотров на человека в день; '
      '8 ч/день, 365 дней/год; 20 новых карточек в день; 1 новый лайк на человека в день. '
      'Число пользователей постоянно; карточки, лайки и медиа хранятся все 5 лет.'),
    p('1 Нагрузка число ядер и оперативная память', 'head'),
    p('Один просмотр: GET /api/andromeda-stars + GET /api/andromeda-stars/feed + '
      'GET изображения + GET видео = <b>4 HTTP-запроса</b>. На пользователя также '
      '1 POST лайка и 2 запроса входа/выхода в день. Новая карточка: POST создания, '
      'PUT публикации, 2 GET черновика и 2 внутренних PUT в S3 = 6 запросов.'),
    p('<b>RPS<sub>ср</sub> = [10 000 × (30 × 4 + 1 + 2) + 20 × 6] / (8 × 3600) '
      '= 1 230 120 / 28 800 ≈ 42,71 запроса/с.</b><br/>'
      'Коэффициент пика 3: <b>RPS<sub>пик</sub> ≈ 42,7125 × 3 ≈ 128,14 запроса/с.</b> '
      'Принято 50 запросов/с на ядро (20 мс CPU/запрос), допустимая загрузка 70%.<br/>'
      '<b>Ядра = ceil[128,14 / (50 × 0,70)] = 4; ОП = 4 × 4 ГБ = 16 ГБ.</b>'),
    p('2 Размер полей таблицы услуг andromeda_stars', 'head'),
    p('Оценка несжатых данных: UTF-8 до 4 Б/символ, до 4 Б заголовка строки; '
      'NUMERIC зарезервирован с запасом. Лимит описания взят из API; URL - ключи объектов '
      'загрузки через API. Физический размер зависит от TOAST, выравнивания и индексов.', 'small'),
]
rows = [[p('Поле', 'cellbold'), p('Тип и допущение', 'cellbold'), p('Расчёт в байтах', 'cellbold'), p('Байт', 'cellbold')]]
for name, typ, expression, size in STAR_FIELDS:
    rows.append([p(name, 'cell'), p(typ, 'cell'), p(expression, 'cell'), p(num(size), 'cell')])
rows.append([p('Итого поля одной карточки', 'cellbold'), '', '', p(num(STAR_BYTES), 'cellbold')])
table = Table(rows, colWidths=[125, 180, 120, 70], hAlign='LEFT')
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ededed')),
    ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f5f5f5')),
    ('SPAN', (0, -1), (2, -1)),
    ('GRID', (0, 0), (-1, -1), .4, colors.HexColor('#d0d0d0')),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
]))
story.extend([
    table, Spacer(1, 5),
    p('<b>andromeda_users:</b> user_id 8 + username (100 ASCII + 4) 104 + '
      'password_hash (принято 128 + 4) 132 + created_at 8 = <b>252 Б/пользователь.</b><br/>'
      '<b>andromeda_likes:</b> user_id 8 + star_id 8 + created_at 8 = <b>24 Б/лайк.</b>', 'small'),
    p('3 Прирост базы данных и S3 за пять лет', 'head'),
    p('<b>Карточки: 20 × 365 × 5 = 36 500; лайки: 10 000 × 365 × 5 = 18 250 000.</b><br/>'
      'К строке принято 40 Б на служебные данные и выравнивание; коэффициент 2 - '
      'резерв на индексы, страницы, TOAST и эксплуатационный запас.<br/>'
      '<b>БД = 2 × [36 500 × (9384 + 40) + 18 250 000 × (24 + 40) + '
      '10 000 × (252 + 40)] = 3 029 792 000 Б ≈ 3,03 ГБ.</b>'),
    p('На карточку: изображение до 5 MiB = 5 242 880 Б и видео до 20 MiB = 20 971 520 Б '
      '(лимиты API); за 5 лет 36 500 × 2 = 73 000 объектов.<br/>'
      '<b>S3 = 36 500 × (5 + 20) × 1 048 576 = 956 825 600 000 Б ≈ 956,83 ГБ.</b><br/>'
      'Для ОС, контейнеров, Redis, ограниченных журналов/WAL и начальных данных принято 30 ГБ; '
      'свободный запас 25% от занятого объёма.<br/>'
      '<b>Диск = (3 029 792 000 + 956 825 600 000 + 30 000 000 000) × 1,25 '
      '= 1 237 319 240 000 Б ≈ 1,24 ТБ.</b>'),
    p('Итоговая конфигурация 4 ядра 16 ГБ ОП SSD 2 ТБ', 'result'),
    p('Один рабочий экземпляр, резервные копии на отдельном носителе. 1 ГБ = 10<super>9</super> Б; '
      '1 ТБ = 10<super>12</super> Б; 1 MiB = 2<super>20</super> Б. Для RPS принято по одному запросу на медиа без кэша; '
      'повторные Range-запросы и загрузка статики не учтены. CPU и пропускную способность сети '
      'нужно подтвердить нагрузочным тестом перед эксплуатацией.', 'small'),
    p('Источники: '
      '<link href="https://github.com/Akkeup/IAD-Course-Backend-/tree/lab4-docs%2Bjwt/migrations">схема БД</link>; '
      '<link href="https://github.com/Akkeup/IAD-Course-Backend-/blob/lab4-docs%2Bjwt/src/handlers/api_dto.rs">лимиты API</link> '
      '(ветка lab4-docs+jwt, ddac3ee); '
      '<link href="https://www.postgresql.org/docs/16/datatype.html">PostgreSQL 16 типы</link>; '
      '<link href="https://www.postgresql.org/docs/16/storage-page-layout.html">формат хранения</link>.', 'small'),
])

def footer(canvas, doc):
    canvas.setFont('Body', 7)
    canvas.setFillColor(colors.HexColor('#666666'))
    canvas.drawRightString(A4[0] - 44, 22, f'{doc.page}')

pdf = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=44, leftMargin=44,
                        topMargin=32, bottomMargin=32,
                        title='Расчёт аппаратных требований M31 Galaxy Andromeda',
                        author='M31 Galaxy Andromeda', pageCompression=1)
pdf.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
print(f'RPS={RPS:.6f}; peak={PEAK:.6f}; cores={CORES}; DB={DB}; S3={S3}; disk={DISK:.0f}')
