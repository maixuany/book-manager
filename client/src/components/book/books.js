import { List, Datagrid, TextField } from "react-admin";

const BookList = () => {
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="author" />
      <TextField source="by_user" />
    </Datagrid>
  </List>;
};

export default BookList;
