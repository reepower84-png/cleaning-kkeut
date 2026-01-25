"use client";

import { useState, useEffect } from "react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: "대기중" | "연락완료" | "상담완료";
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
        setIsAuthenticated(true);
        localStorage.setItem("adminPassword", password);
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    const savedPassword = localStorage.getItem("adminPassword") || password;
    try {
      const response = await fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${savedPassword}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
      }
    } catch {
      console.error("Failed to fetch inquiries");
    }
  };

  const updateStatus = async (id: string, status: Inquiry["status"]) => {
    const savedPassword = localStorage.getItem("adminPassword") || password;
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedPassword}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        fetchInquiries();
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const savedPassword = localStorage.getItem("adminPassword") || password;
    try {
      const response = await fetch(`/api/admin?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${savedPassword}`,
        },
      });

      if (response.ok) {
        fetchInquiries();
      }
    } catch {
      console.error("Failed to delete inquiry");
    }
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem("adminPassword");
    if (savedPassword) {
      setPassword(savedPassword);
      fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${savedPassword}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              setInquiries(data.inquiries);
              setIsAuthenticated(true);
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Inquiry["status"]) => {
    switch (status) {
      case "대기중":
        return "bg-yellow-100 text-yellow-800";
      case "연락완료":
        return "bg-blue-100 text-blue-800";
      case "상담완료":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              청소대행끗 관리자
            </h1>
            <p className="text-gray-600">비밀번호를 입력해주세요.</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="비밀번호"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            청소대행끗 관리자
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchInquiries}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              새로고침
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("adminPassword");
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              문의 목록 ({inquiries.length}건)
            </h2>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              접수된 문의가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      접수일시
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이름
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      전화번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상담문의
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {inquiry.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={inquiry.message}>
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={inquiry.status}
                          onChange={(e) =>
                            updateStatus(
                              inquiry.id,
                              e.target.value as Inquiry["status"]
                            )
                          }
                          className={`text-sm rounded-full px-3 py-1 font-medium border-0 cursor-pointer ${getStatusColor(
                            inquiry.status
                          )}`}
                        >
                          <option value="대기중">대기중</option>
                          <option value="연락완료">연락완료</option>
                          <option value="상담완료">상담완료</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
