import styled from 'styled-components';

const TableContainer = styled.table`
  border-collapse: collapse;
`;

const Header = styled.div`
  display: table-row;
  & > div {
    display: table-cell;
    color: white;
    background: ${({ theme }) => theme.colors.lightpurple};
    padding: 5px;
    &:first-child {
      border-top-left-radius: 5px;
    }
    &:last-child {
      border-top-right-radius: 5px;
    }
  }
`;

const Row = styled.div`
  display: table-row;
  background: lightgray;
  & > div {
    padding: 10px 20px;
    display: table-cell;
  }
`;

interface Table {
  headers: string[];
  data: Record<string, unknown>[];
  children: (row: Record<string, unknown>) => React.ReactNode[];
}

const Table: React.FC<Table> = ({ headers, data, children: handleRow }) => {
  return (
    <TableContainer>
      <Header>
        {headers.map((name) => (
          <div>{name}</div>
        ))}
      </Header>
      {data.map((row) => (
        <Row>
          {handleRow(row).map((column) => (
            <div>{column}</div>
          ))}
        </Row>
      ))}
    </TableContainer>
  );
};

export default Table;
