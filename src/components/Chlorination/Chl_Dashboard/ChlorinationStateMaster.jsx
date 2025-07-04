import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import DashboardLayout from './DashboardLayout';

export default function HubDistrictMaster() {
  const [hubs, setHubs] = useState([]);
  const [newHub, setNewHub] = useState({ hub_name: '' });
  const [newDistrict, setNewDistrict] = useState({ district_name: '', hub_id: '' });
  const [loading, setLoading] = useState(false);
  const [hubFilter, setHubFilter] = useState(""); // new filter state

  const fetchHubs = async () => {
    try {
      const res = await fetch('http://localhost:3000/dashboard/hubs-districts');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setHubs(data);
    } catch (err) {
      console.error('Failed to fetch hubs:', err);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const handleAddHub = async () => {
    if (!newHub.hub_name.trim()) return alert("Please enter hub name");

    try {
      setLoading(true);
      await fetch('http://localhost:3000/dashboard/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHub),
      });
      setNewHub({ hub_name: '' });
      await fetchHubs();
    } catch (err) {
      console.error('Add hub failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDistrict = async () => {
    if (!newDistrict.hub_id || !newDistrict.district_name.trim())
      return alert("Please select hub and enter district name");

    try {
      setLoading(true);
      await fetch('http://localhost:3000/dashboard/district', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDistrict),
      });
      setNewDistrict({ district_name: '', hub_id: '' });
      fetchHubs();
    } catch (err) {
      console.error('Add district failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: 24, display: 'grid', gap: 32 }}>

        {/* Add Hub */}
        <Card>
          <CardContent>
            <Typography variant="h6">Add Hub</Typography>
            <TextField
              label="Hub Name"
              fullWidth
              margin="normal"
              value={newHub.hub_name}
              onChange={e => setNewHub({ hub_name: e.target.value })}
            />
            <Button
              variant="contained"
              onClick={handleAddHub}
              disabled={loading}
            >
              Add Hub
            </Button>
          </CardContent>
        </Card>

        {/* Add District */}
        <Card>
          <CardContent>
            <Typography variant="h6">Add District</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Hub</InputLabel>
              <Select
                value={newDistrict.hub_id}
                onChange={e => setNewDistrict({ ...newDistrict, hub_id: e.target.value })}
                label="Hub"
              >
                {hubs.map(hub => (
                  <MenuItem key={hub.hub_id} value={hub.hub_id}>
                    {hub.hub_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="District Name"
              fullWidth
              margin="normal"
              disabled={!newDistrict.hub_id}
              value={newDistrict.district_name}
              onChange={e => setNewDistrict({ ...newDistrict, district_name: e.target.value })}
            />

            <Button
              variant="contained"
              onClick={handleAddDistrict}
              disabled={loading || !newDistrict.hub_id}
            >
              Add District
            </Button>
          </CardContent>
        </Card>

        {/* Display Hubs */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hubs
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Hub Name</strong></TableCell>
                  <TableCell><strong>Hub ID</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hubs.map(hub => (
                  <TableRow key={hub.hub_id}>
                    <TableCell>{hub.hub_name}</TableCell>
                    <TableCell>{hub.hub_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Display Districts */}
        <Card style={{ marginTop: 32 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Districts
            </Typography>

            {/* Filter by Hub */}
            <FormControl fullWidth margin="normal" size="small" sx={{ maxWidth: 300 }}>
              <InputLabel>Filter by Hub</InputLabel>
              <Select
                value={hubFilter}
                onChange={(e) => setHubFilter(e.target.value)}
                label="Filter by Hub"
              >
                <MenuItem value="">All Hubs</MenuItem>
                {hubs.map((hub) => (
                  <MenuItem key={hub.hub_id} value={hub.hub_id}>
                    {hub.hub_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>District Name</strong></TableCell>
                  <TableCell><strong>District Code</strong></TableCell>
                  <TableCell><strong>Hub Name</strong></TableCell>
                  <TableCell><strong>Hub ID</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hubs
                  .filter((hub) => !hubFilter || hub.hub_id === hubFilter)
                  .flatMap((hub) =>
                    hub.districts?.map((district) => (
                      <TableRow key={`${hub.hub_id}-${district.district_code}`}>
                        <TableCell>{district.district_name}</TableCell>
                        <TableCell>{district.district_code}</TableCell>
                        <TableCell>{hub.hub_name}</TableCell>
                        <TableCell>{hub.hub_id}</TableCell>
                      </TableRow>
                    ))
                  )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
