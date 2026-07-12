
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';

const Unauthorized = () => {
  return (
    <div>
      <PageHeader title='Unauthorized' />
      <Card>
        <div style={{ padding: '24px', color: 'var(--text-muted)' }}>
          Unauthorized module is under construction.
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
