<template>
  <div>
  <div class="billDetail">
      <div class="biName">卢泉林的账单</div>
      <div class="billNum">
        <div class="top">
          <el-table
    :data="bill"
    style="width: 100%"
    border>
     <el-table-column
      label="创建人"
      prop="user_name"
      align="center">
    </el-table-column>
     <el-table-column
      label="创建时间"
      prop="bill_date"
      align="center">
    </el-table-column>
    </el-table>
          <!-- <div class="topOne">
            创建人：
            <el-input
  placeholder="请输入内容"
  v-model="bill.user_name"
  :disabled="true"
  style="height:0;border:none">
</el-input>
          </div>
          <div class="topTwo">
             创建时间：
            <el-input
  placeholder="请输入内容"
  v-model="bill.bill_date"
  :disabled="true"
  style="height:0;border:none">
</el-input>
          </div> -->
        </div>
        <div class="bottom">
          <el-table
    :data="bill"
    style="width: 100%"
    border>
     <el-table-column
      label="账单状态"
      prop="bill_sate"
      align="center">
    </el-table-column>
     <el-table-column
      label="账单人数"
      prop="bill_num"
      align="center">
    </el-table-column>
    </el-table>
          <!-- <div class="bottomOne">
             账单状态：
            <el-input
  placeholder="请输入内容"
  v-model="bill.bill_sate"
  :disabled="true"
  style="height:0;border:none">
</el-input>
          </div>
          <div class="bottomTwo">

             账单人数：
            <el-input
  placeholder="请输入内容"
  v-model="bill.bill_num"
  :disabled="true"
  style="height:0;border:none">
</el-input>
          </div> -->
        </div>
      </div>
      

  </div>

    <div>
     <el-input v-model="search" style="width:200px" placeholder="请输入用户昵称" ></el-input>
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
      label="用户昵称"
      prop="user_name"
      align="center">
    </el-table-column>
    <el-table-column
      label="用户性别"
      prop="user_sex"
      align="center">
    </el-table-column>
    <el-table-column
      label="加入时间"
      prop="buser_time"
      align="center">
    </el-table-column>
    <el-table-column
      label="加入状态"
      prop="buser_if"
      align="center" :formatter="buserIf">
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
      bill_id: 0,
      bill: [],
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
          "/api/Bill/selectVagueBillDetail",
          qs.stringify({
            bill_id: this.bill_id,
            user_name: this.search
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
    buserIf: function(row, column) {
      return row.buser_if == "1" ? "已进入" : "已退出";
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
    this.bill_id = this.$route.query.bill_id;
    var url = "/api/Bill/selectBillDetail";
    this.axios
      .post(
        url,
        qs.stringify({
          bill_id: this.bill_id
        })
      )
      .then(res => {
        var result = res.data.data;
        this.tableData = res.data.data;
        this.bill = [
          {
            user_name: result[0].bill_name,
            bill_date: result[0].bill_date,
            bill_sate: result[0].bill_state == 1 ? "存在" : "已删除",
            bill_num: result.length
          }
        ];
      })
      .catch(error => {});
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.billDetail {
  width: 100%;
  // height: 400px;
  border: 2px solid #03152a;
  margin-bottom: 20px;
  //  background: rgb(226, 225, 231);
}
.biName {
  width: 100%;
  height: 20%;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}
.billNum {
  height: 80%;

  // padding: 2%;
}
.top {
  height: 50%;
  display: flex;
}
.top div {
  width: 50%;
  height: 100%;
  border-top: 1px solid #03152a;
}
.bottom {
  height: 50%;
  display: flex;
}
.bottom div {
  width: 50%;
  height: 100%;
  border-top: 1px solid #919599;
}
</style>
