import { useEffect, useState } from 'react';
import { DEFAULT_IMAGE } from '../components/StarMedia';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createStar, fetchDraft, publishStar } from '../store/servicesSlice';

export function AddPage() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.services.error);
  const draft = useAppSelector((state) => state.services.draft);
  const [name, setName] = useState('');
  const [image, setImage] = useState<File>();
  const [video, setVideo] = useState<File>();
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [catalogId, setCatalogId] = useState('');
  const [distance, setDistance] = useState('0');
  const [velocity, setVelocity] = useState('0');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!draft) return;
    setName(draft.name);
    setCatalogId(draft.catalog_id);
    setDistance(draft.distance_kpc);
    setVelocity(String(draft.velocity_kms));
    setDescription(draft.description);
  }, [draft]);

  function chooseImage(file: File | undefined) {
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  async function createDraft(event: React.FormEvent) {
    event.preventDefault();
    if (!image || !video) return;
    const result = await dispatch(createStar({ name, image, video }));
    if (createStar.fulfilled.match(result)) void dispatch(fetchDraft());
  }

  async function publish(event: React.FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const result = await dispatch(publishStar({
      id: draft.id,
      name,
      catalog_id: catalogId,
      distance_kpc: Number(distance),
      velocity_kms: Number(velocity),
      description,
    }));
    if (publishStar.fulfilled.match(result)) window.location.hash = '#/catalog';
  }

  return <>
    <p className="status-label">{draft ? 'Черновик' : 'Добавление'}</p>
    <h1>{draft ? 'Опубликовать звезду' : 'Новая звезда'}</h1>
    <p className="unsaved-badge">{draft ? 'черновик в БД' : 'не сохранено'}</p>

    {!draft ? <form className="draft-form" onSubmit={createDraft}>
      <div className="media-fields">
        <label className="media-field">
          <img src={imagePreview} alt="Предпросмотр изображения" onError={(event) => { event.currentTarget.src = DEFAULT_IMAGE; }} />
          <span className="media-field__shade" aria-hidden="true" />
          <span className="media-field__icon" aria-hidden="true">▣</span>
          <span>{image?.name || 'изображение'}</span>
          <input type="file" accept="image/*" required onChange={(event) => chooseImage(event.currentTarget.files?.[0])} />
        </label>
        <label className="media-field">
          <img src={imagePreview} alt="" aria-hidden="true" />
          <span className="media-field__shade" aria-hidden="true" />
          <span className="media-field__icon media-field__icon--play" aria-hidden="true">▷</span>
          <span>{video?.name || 'видео'}</span>
          <input type="file" accept="video/*" required onChange={(event) => setVideo(event.currentTarget.files?.[0])} />
        </label>
      </div>
      <label className="field field--wide"><span>Название звезды</span><input type="text" value={name} onChange={(event) => setName(event.target.value)} required /></label>
      <button className="action-button action-button--wide" type="submit">Далее</button>
    </form> : <form className="draft-form" onSubmit={publish}>
      <label className="field field--wide"><span>Название звезды</span><input type="text" value={name} onChange={(event) => setName(event.target.value)} required /></label>
      <div className="field-row">
        <label className="field"><span>Каталожный ID</span><input type="text" value={catalogId} onChange={(event) => setCatalogId(event.target.value)} required /></label>
        <label className="field"><span>R от центра, кпк</span><input type="number" min="0" step="0.1" value={distance} onChange={(event) => setDistance(event.target.value)} required /></label>
      </div>
      <label className="field field--wide"><span>Скорость, км/с</span><input type="number" min="0" step="1" value={velocity} onChange={(event) => setVelocity(event.target.value)} required /></label>
      <label className="field field--wide"><span>Краткая информация</span><textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} required /></label>
      <button className="action-button action-button--wide" type="submit">Опубликовать</button>
    </form>}
    {error && <p className="form-error" role="alert">{error}</p>}
  </>;
}
