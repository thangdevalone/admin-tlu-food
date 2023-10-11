import adminApi from "@/api/adminApi"
import foodsApis from "@/api/foodsApi"
import { AutoField } from "@/components/Common"
import { BillUser, searchRoot } from "@/models"
import { handlePrice } from "@/utils"
import {
  ArrowBackIosNew,
  CloudUpload,
  Delete,
  Replay,
  Visibility,
} from "@mui/icons-material"
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Input,
  Paper,
  Stack,
  Tab,
  Tabs,
} from "@mui/material"
import dayjs from "dayjs"
import { useSnackbar } from "notistack"
import React from "react"
import { useNavigate } from "react-router-dom"

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

const UpdateInvoice = ({ id }: { id: string }) => {
  const [tabs, setTabs] = React.useState(0)
  const [loadding, setLoadding] = React.useState(false)
  const [orderStatus, setOrderStatus] = React.useState("")
  const { enqueueSnackbar } = useSnackbar()
  const [data, setData] = React.useState<BillUser>()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabs(newValue)
  }

  const handleChangeInvoice = () => {
    async function uploadData() {
      if (data?.id){
        try {
          setLoadding(true)
          await adminApi.updateBill(orderStatus,data.id)
          setLoadding(false)
          enqueueSnackbar("Sửa hóa đơn thành công", {
            variant: "success",
          })
        } catch (error) {
          console.log(error)
          setLoadding(false)
          enqueueSnackbar("Có lỗi xảy ra vui lòng thử lại", { variant: "error" })
        }
      }
    }
    uploadData()
  }
  const navigate = useNavigate()

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getDetailBill(Number(id))
        const data = res.data as BillUser
        setOrderStatus(data.orderStatus)
        setData(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  return (
    <Box sx={{ height: "100%" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadding}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: "10px",
          boxShadow: "0 4px 2px -2px rgba(0, 0, 0, 0.2)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <Button
          size="small"
          startIcon={<ArrowBackIosNew fontSize="small" />}
          onClick={() => {
            navigate("/admin/invoice")
          }}
          variant="contained"
          sx={{ mr: "10px", textTransform: "revert" }}
        >
          Đơn hàng
        </Button>
        <IconButton
          onClick={handleChangeInvoice}
          size="small"
          sx={{ mr: "5px" }}
        >
          <CloudUpload fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ mr: "5px" }}>
          <Replay fontSize="small" />
        </IconButton>
      </Stack>
      <Box
        sx={{
          background: "rgb(240, 242, 245)",
          p: "10px",
          height: "calc(100% - 51px)",
        }}
        className="overflow-x-hidden overflow-y-auto"
      >
        <Grid sx={{ width: "100%", height: "100%" }} container spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ width: "100%", height: "100%" }} className="mb-4">
              <p className="font-medium text-lg mb-2">Sửa đơn hàng </p>
              <div className="border   bg-white rounded-md border-gray-300 p-[15px]">
                <div className="flex w-[100%]">
                  <div className="flex-1 mr-[20px]">
                    <label className="font-medium text-md block">
                      Tên đơn hàng
                    </label>
                    <Input
                      fullWidth
                      sx={{ height: "50px", fontSize: "25px", p: 0 }}
                      placeholder="ID hóa đơn"
                      value={`Đơn hàng #${dayjs(data?.createAt).format(
                        "DDMMYY",
                      )}O${data?.id}`}
                    />
                  </div>
                </div>

                <div>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={tabs}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab label="Cấu hình hóa đơn" {...a11yProps(0)} />
                    </Tabs>
                  </Box>
                  <div hidden={tabs !== 0}>
                    {tabs === 0 && (
                      <Box sx={{ padding: "20px 15px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <label
                                  htmlFor="type-food-select"
                                  className="font-medium "
                                >
                                  Trạng thái
                                </label>
                              </Grid>
                              <Grid item xs={8}>
                                <select
                                  id="status"
                                  defaultValue={data?.orderStatus}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>,
                                  ) => {setOrderStatus(e.target.value)}}
                                  className="bg-gray-50 border appearance-none custom-select border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                >
                                  <option value="PENDING">Chờ xác nhận</option>
                                  <option value="PROCESSING">Đang giao</option>
                                  <option value="DELIVERED">
                                    Đã giao hàng
                                  </option>
                                  <option value="CANCELED">Đã hủy</option>
                                </select>
                              </Grid>
                              <Grid item xs={4}>
                                <label
                                  htmlFor="type-food-select"
                                  className="font-medium "
                                >
                                  Giao cho
                                </label>
                              </Grid>
                              <Grid item xs={8}></Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Paper
              elevation={1}
              sx={{
                width: "100%",
                height: "95%",
                borderRadius: "8px",
                p: "10px",
              }}
            >
              Logcat
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default UpdateInvoice
