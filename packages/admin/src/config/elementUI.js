import {
  Table,
  TableColumn,
  Button,
  ButtonGroup,
} from 'element-ui';

export default Vue => {
  Vue.component('ElTable', Table);
  Vue.component('ElTableColumn', TableColumn);
  Vue.component('ElButton', Button);
  Vue.component('ElButtonGroup', ButtonGroup);
}
