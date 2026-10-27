import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { Spinner, SkillIcon } from '../components/ui/index';
import { Plus, Trash2, Edit2, X, Check, Layers, Sparkles } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Language', 'CS Fundamentals', 'Tools'];
const EMPTY_SKILL = { name: '', category: 'Frontend', displayOrder: 0 };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_SKILL);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Custom categories state & new category modal
  const [customCategories, setCustomCategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCustomCategoryActive, setIsCustomCategoryActive] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const fetchSkills = useCallback(() => {
    return api
      .get('/admin/skills')
      .then((r) => setSkills(r.data.data || []))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Merge default categories with all categories present in the database and any newly created custom ones
  const allCategories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...skills.map((s) => s.category).filter(Boolean),
      ...customCategories,
    ])
  );

  const openCreate = (categoryPreset = null) => {
    setForm({
      ...EMPTY_SKILL,
      category: categoryPreset || (allCategories[0] || 'Frontend'),
    });
    setIsCustomCategoryActive(false);
    setCustomCategoryInput('');
    setEditing(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (s) => {
    setForm({
      name: s.name,
      category: s.category,
      displayOrder: s.displayOrder || 0,
    });
    setIsCustomCategoryActive(false);
    setCustomCategoryInput('');
    setEditing(s._id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const finalCategory = isCustomCategoryActive
      ? customCategoryInput.trim()
      : form.category.trim();

    if (!finalCategory) {
      setError('Please provide a valid technical category.');
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: finalCategory,
      displayOrder: Number(form.displayOrder) || 0,
    };

    try {
      if (editing) {
        await api.put(`/admin/skills/${editing}`, payload);
      } else {
        await api.post('/admin/skills', payload);
      }

      if (isCustomCategoryActive && !customCategories.includes(finalCategory)) {
        setCustomCategories((prev) => [...prev, finalCategory]);
      }

      setShowForm(false);
      setIsCustomCategoryActive(false);
      setCustomCategoryInput('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    const cat = newCategoryName.trim();
    if (!cat) return;

    if (!allCategories.includes(cat)) {
      setCustomCategories((prev) => [...prev, cat]);
    }
    setNewCategoryName('');
    setIsAddingCategory(false);
    openCreate(cat);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/admin/skills/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete');
    }
  };

  const handleDeleteCategory = (cat) => {
    if (confirm(`Remove the "${cat}" category from your view?`)) {
      setCustomCategories((prev) => prev.filter((c) => c !== cat));
    }
  };

  const inputSt = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '0.65rem 0.85rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
  };

  const grouped = allCategories.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'var(--text-primary)' }}>
            Technical Skills & Categories
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Manage technical competencies and add custom categories (Cloud, AI/ML, DevOps, Mobile, etc.)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsAddingCategory((v) => !v)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 1rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Layers size={15} style={{ color: 'var(--accent)' }} />
            + New Category
          </button>

          <button
            type="button"
            onClick={() => openCreate()}
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-contrast, #0B0D0C)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 1.15rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <Plus size={16} />
            Add Skill
          </button>
        </div>
      </div>

      {/* Quick Add Category Bar */}
      {isAddingCategory && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <form
            onSubmit={handleCreateCategory}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}
          >
            <div style={{ flex: '1', minWidth: '240px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '0.4rem',
                }}
              >
                New Technical Category Name *
              </label>
              <input
                style={inputSt}
                placeholder="e.g. Cloud & DevOps, AI / Machine Learning, Cyber Security, Mobile"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-contrast, #0B0D0C)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1.25rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Create Category
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategoryName('');
              }}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 0.9rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Skill Modal Card */}
      {showForm && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.75rem',
            boxShadow: '0 8px 24px -6px var(--accent-glow)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {editing ? 'Edit Technical Skill' : 'Add New Technical Skill'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div
              className="admin-grid-2"
              style={{
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Skill Name *
                </label>
                <input
                  style={inputSt}
                  placeholder="e.g. Docker, Kubernetes, AWS, PyTorch, GraphQL"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Technical Category *
                </label>
                {!isCustomCategoryActive ? (
                  <select
                    style={{ ...inputSt, cursor: 'pointer' }}
                    value={form.category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategoryActive(true);
                        setCustomCategoryInput('');
                      } else {
                        setForm((f) => ({ ...f, category: e.target.value }));
                      }
                    }}
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                ) : (
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      style={inputSt}
                      placeholder="Type custom category name..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategoryActive(false)}
                      title="Choose from existing categories"
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0 0.75rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Use list
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  Display Order
                </label>
                <input
                  type="number"
                  style={inputSt}
                  value={form.displayOrder}
                  onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {error && (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  margin: '0 0 1rem',
                }}
              >
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-contrast, #0B0D0C)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 1.4rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {saving ? 'Saving...' : editing ? 'Update Skill' : 'Save Skill'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 1rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3.5rem' }}>
          <Spinner size={32} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.25rem' }}>
          {allCategories.map((cat) => {
            const catSkills = grouped[cat] || [];
            const isCustom = !DEFAULT_CATEGORIES.includes(cat);

            return (
              <div
                key={cat}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingBottom: '0.65rem',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontWeight: 800,
                          fontSize: '0.98rem',
                          margin: 0,
                          color: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        {cat}
                        {isCustom && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '9999px',
                              background: 'var(--accent-dim)',
                              border: '1px solid var(--accent-border)',
                              color: 'var(--accent)',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                            }}
                          >
                            Custom
                          </span>
                        )}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {catSkills.length} {catSkills.length === 1 ? 'skill' : 'skills'}
                      </span>
                    </div>

                    {isCustom && catSkills.length === 0 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        title="Remove empty category"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '0.25rem',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {catSkills.length === 0 ? (
                    <div
                      style={{
                        padding: '1.5rem 0.5rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                      }}
                    >
                      No skills added yet
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                      {catSkills.map((s) => (
                        <div
                          key={s._id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.45rem 0.6rem',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                            <SkillIcon name={s.name} size={16} />
                            <span
                              style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {s.name}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => openEdit(s)}
                              title="Edit Skill"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '0.3rem',
                                borderRadius: '4px',
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(s._id)}
                              title="Delete Skill"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '0.3rem',
                                borderRadius: '4px',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openCreate(cat)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-base)',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Plus size={14} />
                  Add to {cat}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
