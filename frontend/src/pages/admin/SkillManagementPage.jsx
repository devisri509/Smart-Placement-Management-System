import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { Award, Plus, Trash2, Search, Filter, AlertTriangle, Tag, BookOpen } from 'lucide-react';

const SkillManagementPage = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Create Skill Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newSkillDescription, setNewSkillDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Delete Skill Modal State
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSkillsAndCategories();
  }, []);

  const fetchSkillsAndCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const [skillRes, catRes] = await Promise.all([
        adminService.getAllSkills().catch(() => ({ data: [] })),
        adminService.getSkillCategories().catch(() => ({ data: [] })),
      ]);

      const skillList = skillRes.data || skillRes || [];
      const catList = catRes.data || catRes || [];

      setSkills(skillList);
      setCategories(catList);
      if (catList.length > 0) {
        setSelectedCategoryId(catList[0].id);
      }
    } catch (err) {
      setError('Failed to load master skill taxonomy catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setCreating(true);
    setActionSuccess('');
    setActionError('');

    try {
      const payload = {
        name: newSkillName.trim(),
        categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : null,
        description: newSkillDescription.trim(),
      };

      const res = await adminService.createSkill(payload);
      if (res.success || res.data) {
        setActionSuccess(`Master skill "${newSkillName}" created successfully!`);
        setNewSkillName('');
        setNewSkillDescription('');
        setIsCreateModalOpen(false);
        fetchSkillsAndCategories();
      } else {
        setActionError(res.message || 'Failed to create new master skill.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error creating skill taxonomy item.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;
    setDeleting(true);
    setActionSuccess('');
    setActionError('');

    try {
      const res = await adminService.deleteSkill(skillToDelete.id);
      if (res.success || res.message) {
        setActionSuccess(`Master skill "${skillToDelete.name}" deleted successfully.`);
        fetchSkillsAndCategories();
      } else {
        setActionError(res.message || 'Failed to delete skill.');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Error deleting master skill item.');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setSkillToDelete(null);
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.categoryName?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' ||
      s.categoryName === categoryFilter ||
      s.categoryId === parseInt(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchSkillsAndCategories} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Master Skill Taxonomy Catalog</h1>
            <p className="text-sm text-slate-300 mt-1">Configure global skill registry, technical categories, and framework tags.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 rounded-2xl text-right">
              <span className="text-xs text-indigo-300 block font-medium">Master Skills Registered</span>
              <span className="text-2xl font-black text-indigo-400">{skills.length}</span>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add New Skill
            </Button>
          </div>
        </div>

        {/* Toolbar Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search skill by name, category, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl flex justify-between items-center">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:text-emerald-900">&times;</button>
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold rounded-2xl flex justify-between items-center">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-rose-600 hover:text-rose-900">&times;</button>
        </div>
      )}

      {/* Skills Table Card */}
      <Card title={`Technical Skills Catalog (${filteredSkills.length} of ${skills.length})`}>
        {filteredSkills.length > 0 ? (
          <Table
            headers={['ID', 'Skill Name', 'Category', 'Description', 'Actions']}
            data={filteredSkills}
            renderRow={(s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3.5 font-mono text-xs text-slate-500">#{s.id}</td>
                <td className="px-4 py-3.5 font-bold text-slate-900 text-sm">{s.name}</td>
                <td className="px-4 py-3.5 text-xs text-indigo-600 font-semibold">
                  <Badge variant="primary">{s.categoryName || 'General'}</Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{s.description || 'Technical capability tag.'}</td>
                <td className="px-4 py-3.5">
                  <Button
                    variant="danger"
                    size="xs"
                    icon={Trash2}
                    onClick={() => {
                      setSkillToDelete(s);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState title="No Skills Found" description="No master skill entries match your filter criteria." />
        )}
      </Card>

      {/* Create Skill Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="➕ Add Master Technical Skill">
        <form onSubmit={handleCreateSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Skill Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. React.js, Spring Boot, Docker, PyTorch"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {categories.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Skill Category</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Skill Description</label>
            <textarea
              rows={3}
              placeholder="Brief description or framework details..."
              value={newSkillDescription}
              onChange={(e) => setNewSkillDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={creating}>
              Create Master Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Skill Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="⚠️ Delete Master Skill">
        {skillToDelete && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 space-y-1">
                <p className="font-bold text-sm">Delete Skill Tag?</p>
                <p>Are you sure you want to remove <strong className="font-bold">{skillToDelete.name}</strong> from the global skill taxonomy catalog?</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteSkill} loading={deleting}>
                Confirm & Delete Skill
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SkillManagementPage;
