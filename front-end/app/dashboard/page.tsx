'use client'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
import Table from '../components/table/table'
import SearchBar from '../components/ui/searchbar'
import Button from '../components/ui/button'

// Example data - replace with your actual data fetching
const mockData = [
  { id: 1, name: 'Project A', status: 'active', progress: '75%', deadline: '2024-04-30' },
  { id: 2, name: 'Project B', status: 'pending', progress: '30%', deadline: '2024-05-15' },
]

const columns = [
  { key: 'name', header: 'Project Name' },
  { key: 'status', header: 'Status',
    render: (value: string) => (
      <span className={`rounded-full px-2 py-1 text-sm ${
        value === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {value}
      </span>
    )
  },
  { key: 'progress', header: 'Progress' },
  { key: 'deadline', header: 'Deadline' },
]

export default function Dashboard() {
  // const router = useRouter()
  // const [isLoading, setIsLoading] = useState(true)
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       // Replace this with your actual auth check
  //       const authStatus = localStorage.getItem('isLoggedIn') === 'true'
  //       setIsAuthenticated(authStatus)
        
  //       if (!authStatus) {
  //         router.push('/login')
  //       }
  //     } catch (error) {
  //       console.error('Auth check failed:', error)
  //       router.push('/login')
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   checkAuth()
  // }, [router])

  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="text-lg">Loading...</div>
  //     </div>
  //   )
  // }

  // if (!isAuthenticated) {
  //   return null // Router will handle redirect
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <SearchBar 
              placeholder="Search projects..."
              onSearch={(term) => console.log('Searching:', term)}
            />
            <Button 
              label="New Project"
              onClick={() => console.log('Create new project')}
            />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['Total Projects', 'Active Projects', 'Completed', 'In Progress'].map((stat) => (
              <div key={stat} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">{stat}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
              </div>
            ))}
          </div>

          {/* Projects Table */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Projects Overview</h2>
            <Table 
              columns={columns}
              data={mockData}
              onRowClick={(row) => console.log('Selected project:', row)}
              emptyMessage="No projects found"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
