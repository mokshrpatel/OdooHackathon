
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';

const Unauthorized = () => {
  return (
    <div>
      <PageHeader title='Unauthorized' />
      <Card>
        <div style={{ padding: '24px', color: 'var(--text-main)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Access Denied</h2>
          <p>You do not have permission to view this module. Please contact your Fleet Manager if you require access.</p>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
