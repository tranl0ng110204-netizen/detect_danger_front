import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import 'antd/dist/reset.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    locale={viVN}
    theme={{
      token: {
        colorPrimary: '#1677ff',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        colorInfo: '#0284c7',
        borderRadius: 8,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        colorBgLayout: '#f8fafc',
        colorTextHeading: '#0f172a',
        colorText: '#334155',
        colorTextSecondary: '#64748b',
        colorBorder: '#e2e8f0',
      },
      components: {
        Layout: {
          headerBg: '#ffffff',
          bodyBg: '#f8fafc',
          siderBg: '#0f172a',
        },
        Card: {
          borderRadiusLG: 14,
          headerHeight: 48,
        },
        Button: {
          controlHeight: 38,
          borderRadius: 8,
          fontWeight: 600,
        },
        Table: {
          headerBg: '#f8fafc',
          headerColor: '#475569',
          borderRadius: 12,
        },
        Menu: {
          darkItemBg: '#0f172a',
          darkItemSelectedBg: '#1677ff',
          darkItemHoverBg: '#1e293b',
          itemBorderRadius: 8,
          itemMarginInline: 10,
        },
      },
    }}
  >
    <App />
  </ConfigProvider>
);