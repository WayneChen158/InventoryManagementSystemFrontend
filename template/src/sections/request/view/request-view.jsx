import Iconify from 'src/components/iconify';
import { Container, Stack, Typography, Button, Card } from '@mui/material';

export default function RequestPage() {
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Request</Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                    New Request
                </Button> 
            </Stack>
            <Card>

            </Card>
        </Container>
    );
}