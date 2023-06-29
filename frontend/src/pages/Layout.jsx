import Navbar from '../components/Dashboard/Navbar'
import Sidebar from '../components/Dashboard/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <Navbar />
            <div className=''>
                <Sidebar />
                <div className="p-4 sm:ml-64">
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default Layout
