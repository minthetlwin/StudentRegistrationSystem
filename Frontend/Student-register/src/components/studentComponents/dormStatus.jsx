 function DormStatusPage() {

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/dorm/my-registration");
    if (res.data.exists) {
      setData(res.data.data);
    }
    setLoading(false);
  }

  if (loading) return <p>Loading...</p>;

  if (!data) 
    return <p>You haven't submitted a dorm registration yet.</p>;

  return (
    <div className="bg-white rounded-xl p-6 shadow max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Dorm Registration Status</h2>

      <p><strong>Semester: </strong>{data.semester.name}</p>
      <p><strong>Submitted: </strong>{new Date(data.createdAt).toLocaleDateString()}</p>
      <p><strong>Status: </strong>
        <span className={`
          ${data.status === "APPROVED" ? "text-green-600" : ""}
          ${data.status === "REJECTED" ? "text-red-600" : ""}
          ${data.status === "PENDING" ? "text-yellow-600" : ""}
        `}>
          {data.status}
        </span>
      </p>

      {data.adminRemark && (
        <p><strong>Admin remark:</strong> {data.adminRemark}</p>
      )}
    </div>
  );
}
