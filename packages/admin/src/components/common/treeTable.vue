<template>
  <div>
    <el-table
      :data="tableInfo.tableData"
      style="width: 100%;margin-bottom: 20px;"
      border
      default-expand-all
      row-key="id">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="(col, i) in tableInfo.tableColumns"
        :key="i"
        :prop="col.key"
        :label="col.label"
        width="100">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="name"-->
        <!--label="姓名"-->
        <!--width="180">-->
      <!--</el-table-column>-->

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'TreeTable',
    props: {
      tableInfo: {
        type: Object,
        default: () => []
      }
    }

  }

</script>
