<template>

  <div>
    <div>
     <el-input v-model="search" style="width:200px" placeholder="请输入类别名称" ></el-input>
     <el-select v-model="region" filterable  placeholder="请选择类别类型" @change="selectRole()">
    
        <el-option v-for="item in vagueData" :key="item.type_id" :label="item.type_mark==0?'支出':'收入'" :value="item.type_mark" ></el-option>

    </el-select>
      <el-button type="primary" icon="el-icon-circle-plus"  @click="add">添加类别</el-button>
    </div>



  <el-table
    :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
    style="width: 100%"
    border>
    <el-table-column
      label="序号"
      type="index"
      width="200"
      sortable
      :index="indexMethod"
      align="center">
    </el-table-column>
    <el-table-column
      label="类别类型"
      prop="type_mark"
      align="center" :formatter="typeMark">
    </el-table-column>
    <el-table-column
      label="类别名称"
      prop="type_name"
      align="center">
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
         
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <!-- <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
              <el-popover
                placement="top"
                title="确定删除？"
                width="200"
                :ref="'popover-' + scope.row.id"
                trigger="click"
              >
	                <div style="text-align: right; margin: 0">
	                  <el-button type="primary" size="mini" @click="handleDelete(scope.$index, scope.row)">确定</el-button>
	                </div>
	                <el-button slot="reference" type="danger"  size="mini">删除</el-button>
              </el-popover>
      </template>
    </el-table-column>
  </el-table>

   <!-- 分页 -->
   <el-pagination background 
			layout="prev, pager, next, sizes, total, jumper"
			:page-sizes="[5, 10, 15, 20]"
			:page-size="pagesize"
			:total="tableData.length"
			@current-change="handleCurrentChange"  
			@size-change="handleSizeChange" 
			>
		</el-pagination>

  <el-dialog title="类别" :visible.sync="dialogFormVisible">
    <el-form @submit.native.prevent>

    <el-form-item label="类别名称" :label-width="formLabelWidth">
      <el-input v-model="type_name" auto-complete="off"></el-input>
    </el-form-item> 

    <el-form-item label="类别类型:" :label-width="formLabelWidth">
        <el-radio-group v-model="type_mark">
        <el-radio label="支出" ></el-radio>
        <el-radio label="收入" ></el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="sure">确 定</el-button>
  </div>
  </el-dialog>



  </div>

</template>

<script>
import qs from "qs";
export default {
  inject: ["reload"],
  data() {
    return {
      allPower_id: [],
      roleDate: [],
      vagueData: [],
      tableData: [],
      index: 1,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      role_name: "",
      role_id: 0,
      region: "",
      defaultProps: {
        children: "listpower",
        label: "power_name"
      },
      pagesize: 5,
      currpage: 1,
      search: "",
      type_mark: 0,
      type_name: "",
      type_id: 0,
      vagueData: [
        {
          type_id: 1,
          type_mark: "0"
        },
        {
          type_id: 2,
          type_mark: "1"
        }
      ]
    };
  },
  watch: {
    search() {
      console.log("??", this.search);
      this.axios
        .post(
          "/api/Type/selectVagueType",
          qs.stringify({
            type_mark: this.region,
            type_name: this.search
          })
        )
        .then(res => {
          this.tableData = res.data.data;
        });
    }
  },
  methods: {
    handleCurrentChange(cpage) {
      this.currpage = cpage;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    },
    typeMark(row, column) {
      return row.type_mark == "0" ? "支出" : "收入";
    },
    add() {
      this.dialogFormVisible = true;
      this.type_id = 0;
      this.type_name = "";
      this.type_mark = "支出";
    },
    indexMethod(index) {
      return index + 1;
    },
    handleDelete(index, row) {
      console.log("删除：", row.type_id);
      this.axios
        .post(
          "/api/Type/updateTypeState",
          qs.stringify({
            type_id: row.type_id
          })
        )
        .then(res => {
          if (res.data.data == 1) {
            this.$message.success("删除类别成功");
            this.reload();
          } else {
            this.$message.error("删除类别失败");
          }
        })
        .catch(error => {
          console.log("error:" + error);
        });
    },
    handleEdit(index, row) {
      console.log("编辑:", row.type_id);

      this.dialogFormVisible = true;
      this.type_name = row.type_name;
      this.type_mark = row.type_mark == "0" ? "支出" : "收入";
      this.type_id = row.type_id;
    },
    sure() {
      var type_mark = this.type_mark == "支出" ? "0" : "1";
      console.log("role_name", this.type_name);
      console.log("type_mark", type_mark);
      console.log("type_id", this.type_id);

      if (this.type_id == 0) {
        if (this.type_name == "") {
          this.$message.error("类型名称不能为空");
        } else {
          this.axios
            .post(
              "/api/Type/insertType",
              qs.stringify({
                type_name: this.type_name,
                type_mark: type_mark
              })
            )
            .then(res => {
              if (res.data.data == 1) {
                this.$message.success("添加类型成功");
                this.reload();
              } else {
                this.$message.error("添加类型失败");
              }
            });
        }
      } else {
        if (this.type_name == "") {
          this.$message.error("类型名称不能为空");
        } else {
          this.axios
            .post(
              "/api/Type/updateType",
              qs.stringify({
                type_name: this.type_name,
                type_id: this.type_id,
                type_mark: type_mark
              })
            )
            .then(res => {
              if (res.data.data == 1) {
                this.$message.success("修改类型成功");
                this.reload();
              } else {
                this.$message.error("修改类型失败");
              }
            });
        }
      }
    },
    selectRole() {
      this.axios
        .post(
          "/api/Type/selectVagueType",
          qs.stringify({
            type_mark: this.region,
            type_name: this.search
          })
        )
        .then(res => {
          this.tableData = res.data.data;
        });
    }
  },
  mounted() {
    var url = "/api/Type/selectAllType";
    this.axios
      .post(url)
      .then(res => {
        this.tableData = res.data.data;
      })
      .catch(error => {});
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
