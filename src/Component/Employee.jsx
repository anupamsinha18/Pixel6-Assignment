import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Employee.css';

const Employee = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [filters, setFilters] = useState({ gender: '', country: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`https://dummyjson.com/users`);
                const totalUsers = response.data.users;
                setTotalPages(Math.ceil(totalUsers.length / 10));
                setUsers(totalUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
        setCurrentPage(1);
    };

    const filteredUsers = users.filter((user) => {
        return (
            (filters.gender === '' || user.gender === filters.gender) &&
            (filters.country === '' || user.address.country.toLowerCase().includes(filters.country.toLowerCase()))
        );
    });

    const sortedUsers = React.useMemo(() => {
        let sortableUsers = [...filteredUsers];
        if (sortConfig.key !== '') {
            sortableUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [filteredUsers, sortConfig]);

    const currentUsers = sortedUsers.slice((currentPage - 1) * 10, currentPage * 10);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, '...', totalPages];
            } else if (currentPage > totalPages - 3) {
                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            }
        }
        return pages.map((page, index) => (
            <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                className={page === currentPage ? 'active' : ''}
                disabled={page === '...'}
            >
                {page}
            </button>
        ));
    };

    return (
        <>
            <div className="header">
              <h4>Employee</h4>
                <div className="filters">
                    <select name="gender" onChange={handleFilterChange} defaultValue="">
                        <option value="" disabled>Gender</option>
                        <option value="">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input
                        name="country"
                        type="text"
                        onChange={handleFilterChange}
                        placeholder="Country"
                    />
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>
                            ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => handleSort('firstName')}>
                            Name {sortConfig.key === 'firstName' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => handleSort('age')}>
                            Age {sortConfig.key === 'age' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th>Gender</th>
                        <th>Image</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.age}</td>
                            <td>{user.gender}</td>
                            <td><img src={user.image} alt={user.firstName} className="userimage" /></td>
                            <td>{user.address.state}, {user.address.country}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {renderPagination()}
            </div>
        </>
    );
};

export default Employee;
