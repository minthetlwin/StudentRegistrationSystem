export const exportToExcel = (registrations) => {
  const approvedRegistrations = registrations.filter(reg => reg.status === 'APPROVED');
  
  if (approvedRegistrations.length === 0) {
    alert('No approved registrations to export');
    return;
  }

  const csvContent = [
    ['Student Name', 'Enrollment Number', 'Semester', 'Academic Year', 'Emergency Contact', 'Approved Date'],
    ...approvedRegistrations.map(reg => [
      reg.student?.full_name || 'N/A',
      reg.student?.enrollment_number || 'N/A',
      reg.semester?.name || 'N/A',
      reg.semester?.academicYear || 'N/A',
     
      reg.emergencyContact || 'N/A',
      new Date(reg.reviewedAt || reg.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `approved-dorm-registrations-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};