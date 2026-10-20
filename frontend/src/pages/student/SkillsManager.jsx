import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { skillService } from '../../services/skillService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Notification from '../../components/common/Notification';

const SkillsManager = () => {
  const [profile, setProfile] = useState(null);
  const [studentSkills, setStudentSkills] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profRes = await studentService.getProfile();
      if (profRes.success && profRes.data) {
        setProfile(profRes.data);
        const [skillsRes, masterRes] = await Promise.all([
          studentService.getStudentSkills(profRes.data.id).catch(() => ({ data: [] })),
          skillService.getAllSkills().catch(() => ({ data: [] })),
        ]);

        setStudentSkills(skillsRes.data || []);
        const allMaster = masterRes.data || [];
        setMasterSkills(allMaster);
        if (allMaster.length > 0) {
          setSelectedSkillId(allMaster[0].id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch skills taxonomy.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    setError('');
    setSuccess('');
    setAdding(true);

    try {
      const res = await studentService.addStudentSkill(profile.id, {
        skillId: Number(selectedSkillId),
        proficiency: proficiency,
      });

      if (res.success) {
        setSuccess('Technical skill added to profile!');
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const res = await studentService.deleteStudentSkill(profile.id, skillId);
      if (res.success) {
        setSuccess('Skill removed.');
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove skill.');
    }
  };

  if (loading) {
    return <Loading message="Loading technical skills taxonomy..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <h1 className="text-2xl font-bold">🏷️ Technical & Programming Skills</h1>
        <p className="text-sm text-slate-300 mt-1">
          Add your technical competencies from the master taxonomy to evaluate job eligibility and skill match percentage.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />
      <Notification type="success" message={success} onClose={() => setSuccess('')} />

      {/* Add Skill Form */}
      <Card title="Add Technical Skill">
        <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Select Technical Skill *</label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {masterSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.categoryName || 'General'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Proficiency Level *</label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="ADVANCED">ADVANCED</option>
              <option value="EXPERT">EXPERT</option>
            </select>
          </div>

          <Button type="submit" variant="primary" loading={adding} className="w-full py-2.5">
            Add Skill to Profile
          </Button>
        </form>
      </Card>

      {/* Profile Skills Chips */}
      <Card title="Saved Profile Skills">
        {studentSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {studentSkills.map((stSkill) => (
              <div key={stSkill.id} className="p-4 border border-slate-200 rounded-xl bg-white flex items-center justify-between shadow-sm hover:border-indigo-300 transition">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{stSkill.skillName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{stSkill.categoryName}</p>
                  <div className="mt-2">
                    <Badge variant="primary" size="xs">
                      {stSkill.proficiency}
                    </Badge>
                  </div>
                </div>
                <Button variant="danger" size="xs" onClick={() => handleDeleteSkill(stSkill.skillId)}>
                  &times;
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No technical skills added yet. Select a skill above to start building your placement match.
          </div>
        )}
      </Card>
    </div>
  );
};

export default SkillsManager;
