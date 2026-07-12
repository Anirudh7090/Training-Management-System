import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';
import { logout, getCurrentUser } from '../../service/auth.service';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">PolymerX</div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">{user?.name}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;