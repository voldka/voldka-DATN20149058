import { Input, Table } from 'antd';
import { useMemo, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useDebounce } from '../../shared/hooks';

const LtDynamicTable = ({
  cols,
  dataSrc = [],
  hasFilters = false,
  searchByFields = [],
  pageSize = 10,
  rowKey = null,
  hasBorder = false,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim() || !searchByFields.length || !hasFilters) {
      return dataSrc;
    }
    const regex = new RegExp(query.trim(), 'i');
    const results = dataSrc.filter((item) => {
      return searchByFields.some((key) => {
        const value = item[key];
        return typeof value === 'string' && value.match(regex);
      });
    });
    return results;
  }, [query, dataSrc]);

  return (
    <>
      {hasFilters && (
        <Input
          placeholder={`Tìm kiếm`}
          prefix={<AiOutlineSearch />}
          onChange={handleQueryChange}
          size='large'
        />
      )}
      <div className='py-2'>
        <Table
          rowKey={rowKey}
          columns={cols}
          dataSource={filteredData}
          pagination={{ position: ['bottomRight'], pageSize, hideOnSinglePage: true }}
          bordered={hasBorder}
        />
      </div>
    </>
  );
};

export default LtDynamicTable;
