import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/ui/Card';

const NotFound = () => {
  return (
    <div>
      <PageHeader title='NotFound' />
      <Card>
        <div style={{ padding: '24px', color: 'var(--text-muted)' }}>
          NotFound module is under construction.
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
