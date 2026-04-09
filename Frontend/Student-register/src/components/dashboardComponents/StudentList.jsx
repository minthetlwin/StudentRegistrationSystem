import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Filter, MoreHorizontal, Plus, Users, UserCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import CurrentStudentsList from './studentListComponents/CurrentStudentsLists';
import NewAdmittedStudentsLists from './studentListComponents/NewAdmittedStudentsLists';
import ViewDetail from '../adminComponents/viewDetail';
import Pagination from '../adminComponents/Pagination';
import EditStudentModal from '../adminComponents/EditStudentModal';
import DeleteConfirmModal from '../adminComponents/DeleteConfirmModal';
import AddAdmittedStudentModal from '../adminComponents/AddAdmittedStudentModal';
import AddCurrentStudentModal from '../adminComponents/AddCurrentStudentModal';

import {
  getNewAdmittedstudents,
  getCurrentstudents,
  updateAdmittedStudentStatus,
  updateStudent,
  deleteStudent,
  addAdmittedStudent,
  addCurrentStudent
} from '../../services/adminServices';

const TABS = {
  CURRENT: 'current',
  ADMITTED: 'admitted',
};

const ITEMS_PER_PAGE = 5;

export default function StudentList() {
  const [activeTab, setActiveTab] = useState(TABS.CURRENT);
  const [students, setStudents] = useState({
    current: [],
    admitted: [],
  });
  const [currentPage, setCurrentPage] = useState({
    current: 1,
    admitted: 1,
  });
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCurrentModal, setShowAddCurrentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [message, setMessage] = useState('');

  const handleAddStudent = async (studentData) => {
    try {
      await addAdmittedStudent(studentData);
      setMessage('Student added successfully!');
      setTimeout(() => setMessage(''), 3000);
      setShowAddModal(false);
      fetchStudents(TABS.ADMITTED);
    } catch (error) {
      setMessage('Error adding student: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleAddCurrentStudent = async (studentData) => {
    try {
      await addCurrentStudent(studentData);
      setMessage('Student added successfully!');
      setTimeout(() => setMessage(''), 3000);
      setShowAddCurrentModal(false);
      fetchStudents(TABS.CURRENT);
    } catch (error) {
      setMessage('Error adding student: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const fetchMap = {
    [TABS.CURRENT]: getCurrentstudents,
    [TABS.ADMITTED]: getNewAdmittedstudents,
  };

  const fetchStudents = async (tab) => {
    try {
      setLoading(true);
      const fetchFn = fetchMap[tab];
      if (!fetchFn) return;
      const res = await fetchFn();
      if (res?.success) {
        setStudents((prev) => ({
          ...prev,
          [tab]: res.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${tab} students:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both tabs on initial mount so count badges are accurate before switching tabs
  useEffect(() => {
    fetchStudents(TABS.CURRENT);
    fetchStudents(TABS.ADMITTED);
  }, []);

  useEffect(() => {
    setCurrentPage((prev) => ({ ...prev, [activeTab]: 1 }));
  }, [activeTab]);

  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage((prev) => ({ ...prev, [activeTab]: page }));
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const isAdmitted = selectedStudent?.g12_exam_id;
      if (isAdmitted) {
        await updateAdmittedStudentStatus(selectedStudent._id, { status: newStatus });
      }
      setMessage(`Student ${newStatus.toLowerCase()} successfully!`);
      setTimeout(() => setMessage(''), 3000);
      setSelectedStudent(null);
      fetchStudents(activeTab);
    } catch (error) {
      setMessage('Error updating status: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(null);
    setEditingStudent(student);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      const type = activeTab === TABS.ADMITTED ? 'admitted' : 'current';
      const studentId = editingStudent._id || editingStudent.id;
      if (!studentId) throw new Error('Student ID is missing');
      await updateStudent(studentId, updatedData, type);
      setMessage('Student updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      setEditingStudent(null);
      fetchStudents(activeTab);
    } catch (error) {
      setMessage('Error updating student: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleDelete = async (student) => {
    setSelectedStudent(null);
    setEditingStudent(null);
    setDeletingStudent(student);
  };

  const confirmDelete = async () => {
    try {
      const type = activeTab === TABS.ADMITTED ? 'admitted' : 'current';
      await deleteStudent(deletingStudent._id, type);
      setMessage('Student deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
      setDeletingStudent(null);
      fetchStudents(activeTab);
    } catch (error) {
      setMessage('Error deleting student: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
      setDeletingStudent(null);
    }
  };

  const tabs = [
    { id: TABS.CURRENT, label: 'Current Students', icon: Users },
    { id: TABS.ADMITTED, label: 'Admitted Students', icon: UserCheck },
  ].map((tab) => ({
    ...tab,
    count: students[tab.id]?.length || 0,
  }));

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium border ${
              message.includes('success')
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-100 shadow-sm shadow-rose-100'
            }`}
          >
            {message.includes('success') ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Container */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Management</h2>
              <p className="text-slate-500 text-sm font-medium">Manage academic profiles and admission status</p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Admitted Student</span>
              </button>
              
              <button
                onClick={() => setShowAddCurrentModal(true)}
                className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center space-x-2 bg-slate-800 hover:bg-slate-900"
              >
                <Plus className="w-4 h-4" />
                <span>Current Student</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-6 mt-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 py-3 border-b-2 font-bold text-sm transition-all relative ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`ml-1.5 px-2 py-0.5 text-[10px] rounded-full font-bold shadow-inner ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-indigo-100'
                      : 'bg-slate-100 text-slate-500 shadow-slate-200'
                  }`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <span className="text-slate-500 font-bold text-sm animate-pulse">Syncing student database...</span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="divide-y divide-slate-50"
            >
              {activeTab === TABS.CURRENT ? (
                <>
                  <div className="p-6">
                    <CurrentStudentsList 
                      students={getPaginatedData(students.current, currentPage.current)} 
                      onViewDetails={setSelectedStudent} 
                    />
                  </div>
                  {students.current.length > ITEMS_PER_PAGE && (
                    <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                      <Pagination
                        currentPage={currentPage.current}
                        totalPages={getTotalPages(students.current)}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="p-6">
                    <NewAdmittedStudentsLists 
                      students={getPaginatedData(students.admitted, currentPage.admitted)} 
                      onViewDetails={setSelectedStudent} 
                    />
                  </div>
                  {students.admitted.length > ITEMS_PER_PAGE && (
                    <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                      <Pagination
                        currentPage={currentPage.admitted}
                        totalPages={getTotalPages(students.admitted)}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAdmittedStudentModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddStudent}
        />
      )}

      {showAddCurrentModal && (
        <AddCurrentStudentModal
          onClose={() => setShowAddCurrentModal(false)}
          onSuccess={handleAddCurrentStudent}
        />
      )}

      <ViewDetail
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        studentData={selectedStudent}
        onStatusUpdate={handleStatusUpdate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          mode={activeTab}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deletingStudent && (
        <DeleteConfirmModal
          student={deletingStudent}
          onClose={() => setDeletingStudent(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

