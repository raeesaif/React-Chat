import React from "react";
import { Box, Pagination } from "@mui/material";

const Paginate = ({ count, limit = 10, onChange, defaultNumber }) => {
    if (count === 0) return null;

    return (
        <Box display="flex" justifyContent="center" mt={4} mb={2}>
            <Pagination
                count={Math.ceil(count / limit)}
                defaultPage={defaultNumber}
                onChange={onChange}
                shape="rounded"
                sx={{
                    display: "flex",
                    gap: "8px",
                    "& .MuiPaginationItem-root": {
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: "12px",
                        transition: "all 0.3s ease-in-out",
                        backdropFilter: "blur(5px)",
                        background: "rgba(255, 255, 255, 0.2)",
                        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                        "&:hover": {
                            backgroundColor: "rgba(47, 131, 233, 0.2)",
                            transform: "scale(1.1)",
                        },
                        "&.Mui-selected": {
                            background: "#2F83E9",
                            color: "#fff",
                            boxShadow: "0px 4px 15px rgba(47, 131, 233, 0.4)",
                            transform: "scale(1.15)",
                            "&:hover": {
                                background: "#2F83E9",
                            },
                        },
                    },
                }}
            />
        </Box>
    );
};

export default Paginate;
