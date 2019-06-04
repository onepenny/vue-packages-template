<template>
  <div>
    <com-tree-table :tableInfo="tableInfo"> </com-tree-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableInfo: {
        operations: [],
        tableColumns: [
          {
            label: '类型',
            key: 'type'
          },
          {
            label: '部件名称',
            key: 'compName'
          }
        ],
        tableData: [
          {
            id: 1,
            type: '2016-05-02',
            compName: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id: 2,
            type: '2016-05-04',
            compName: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            children: [
              {
                id: 21,
                type: '2016-05-01',
                compName: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              },
              {
                id: 22,
                type: '2016-05-01',
                compName: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }
            ]
          },
          {
            id: 3,
            type: '2016-05-01',
            compName: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            children: [
              {
                id: 31,
                type: '2016-05-01',
                compName: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              },
              {
                id: 32,
                type: '2016-05-01',
                compName: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
              }
            ]
          },
          {
            id: 4,
            type: '2016-05-03',
            compName: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ]
      }
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    load(tree, treeNode, resolve) {
      resolve([
        {
          id: 31,
          type: '2016-05-01',
          compName: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          id: 32,
          type: '2016-05-01',
          compName: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }
      ]);
    }
  },
  mounted() {}
};
</script>
